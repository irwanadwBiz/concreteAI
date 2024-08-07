import Fastify from "fastify";
import userRoutes from "./modules/users/user.route";
import { userSchemas } from "./modules/users/user.schema";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import { FastifyReply, FastifyRequest } from "fastify";

const server = Fastify();

server.register(fjwt, {
  secret: process.env.JWT_SECRET,
});

server.addHook("preHandler", (req, res, next) => {
  req.jwt = server.jwt;
  return next();
});

server.register(fCookie, {
  secret: process.env.COOKIE_SECRET,
  hook: "preHandler",
});

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.access_token;

    if (!token) {
      return reply
        .status(401)
        .send({
          message: "Authentication required",
          error: "Forbidden Access this route",
        });
    }

    const decoded = request.jwt.verify(token);
    request.user = decoded;
  }
);

async function main() {
  for (const schema of userSchemas) {
    // should be add these schemas before you register your routes
    server.addSchema(schema);
  }

  server.register(userRoutes, { prefix: "api/users" });
  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server listening at http://localhost:3000");
  } catch (error) {
    console.error(error);
    process.exit(1); // exit as failure
  }
}

main();
