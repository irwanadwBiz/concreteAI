import { FastifyInstance } from "fastify";
import {
  createPaymentAccountHandler,
  getPaymentAccountHandler,
  updatePaymentAccountHandler,
  deletePaymentAccountHandler,
  getMyAccountHandler,
} from "./payment-account.controller";
import {
  createPaymentAccountSchema,
  updatePaymentAccountSchema,
  paymentAccountParamsSchema,
} from "./payment-account.schema";
import { $ref } from "./payment-account.schema";

export default async function paymentAccountRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createPaymentAccountSchema"),
        response: {
          201: $ref("paymentAccountResponseSchema"),
        },
      },
    },
    createPaymentAccountHandler
  );

  server.get(
    "/my-account",
    {
      preHandler: [server.authenticate],
    },
    getMyAccountHandler
  );

  server.put(
    "/:id",
    {
      preHandler: [server.authenticate],
      schema: {
        params: $ref("paymentAccountParamsSchema"),
        response: {
          201: $ref("updatePaymentAccountSchema"),
        },
      },
    },
    updatePaymentAccountHandler
  );
  //   server.delete(
  //     "/payment-accounts/:id",
  //     { schema: { params: paymentAccountParamsSchema } },
  //     deletePaymentAccountHandler
  //   );
}
