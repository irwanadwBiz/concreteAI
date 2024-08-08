import { FastifyInstance } from "fastify";
import {
  createTransactionHandler,
  processTransactionHandler,
} from "./transaction.controller";
import { $ref } from "./transaction.schema";


export default async function transactionRoutes(server: FastifyInstance) {
  server.post(
    "/send",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("TransactionInputSchema"),
        response: {
          201: $ref("TransactionResponseSchema"),
        },
      },
    },
    createTransactionHandler
  );
}
