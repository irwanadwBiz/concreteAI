import Fastify from "fastify";
import userRoutes from "./modules/users/user.route";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import { FastifyReply, FastifyRequest } from "fastify";
import paymentAccountRoutes from "./modules/paymentAccounts/payment-account.route";
import { userSchemas } from "./modules/users/user.schema";
import { accountSchemas } from "./modules/paymentAccounts/payment-account.schema";
import { transactionSchemas } from "./modules/transactions/transaction.schema";
import transactionRoutes from "./modules/transactions/transaction.route";
import fastifyCors from "@fastify/cors";

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
    try {
      const token = request.cookies.access_token; // Assuming token from cookies

      if (!token) {
        return reply.status(401).send({
          message: "Authentication required",
          error: "Forbidden Access this route",
        });
      }

      const decoded = request.jwt.verify(token);
      request.user = decoded; // Attach decoded payload to request.user
    } catch (err) {
      reply.status(401).send({
        message: "Authentication failed",
        error: "Invalid or expired token",
      });
    }
  }
);

async function main() {
  for (const schema of [
    ...userSchemas,
    ...accountSchemas,
    ...transactionSchemas,
  ]) {
    server.addSchema(schema);
  }

  server.register(require("@fastify/swagger"), {
    routePrefix: "/swagger", // Ensure this doesn't conflict with other routes
    swagger: {
      info: {
        title: "Docs Concrete AI Assesment",
        description: "Docs Concrete AI Assesmentt",
        version: "1.0.0",
      },
      host: "0.0.0.0:3000",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
    exposeRoute: true,
  });
  server.register(require("@fastify/swagger-ui"), {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "none",
      deepLinking: true,
    },
    exposeRoute: true,
  });
  server.register(fastifyCors, {
    // Adjust the options as needed for your environment
    origin: true, // Reflect the request origin or set to true to allow all
    methods: ["GET", "PUT", "POST", "DELETE"], // Allowable methods
  });
  server.register(userRoutes, { prefix: "api/users" });
  server.register(paymentAccountRoutes, { prefix: "api/payment-account" });
  server.register(transactionRoutes, { prefix: "api/transaction" });

  // Executes Swagger
  server.ready((err) => {
    if (err) throw err;
    server.swagger();
  });
  await server.ready();

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server listening at http://localhost:3000");
  } catch (error) {
    console.error(error);
    process.exit(1); // exit as failure
  }
}

main();
