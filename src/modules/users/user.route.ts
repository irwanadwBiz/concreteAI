import { FastifyInstance } from "fastify";

import { registerUserHandler, loginHandler, getProfile, getProfileHandler } from "./user.controller";
import { $ref } from "./user.schema";

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
        },
      },
    },
    registerUserHandler
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          201: $ref("loginResponseSchema"),
        },
      },
    },
    loginHandler
  );

  server.get(
    "/profile",
    {
      preHandler: [server.authenticate],
    },
    getProfileHandler
  );
}

export default userRoutes;
