import { FastifyReply, FastifyRequest } from "fastify";
import * as TransactionService from "./transaction.service";
import { TransactionInput } from "./transaction.schema";

export async function createTransactionHandler(
  request: FastifyRequest<{
    Body: {
      paymentAccountId: string;
      amount: number;
      currency: string;
      toAddress: string;
    };
  }>,
  reply: FastifyReply
) {
  await request.jwtVerify();

  const userId = request.user.id; // Ensure JWT parsing logic attaches user details to request.user
  const { paymentAccountId, amount, currency, toAddress } = request.body;

  try {
    const payload = {
      paymentAccountId,
      amount,
      currency,
      toAddress,
    };

    const transaction = await TransactionService.createTransaction(
      userId,
      payload
    );

    return reply.status(201).send({
      status: 201,
      message: "Transaction successfully created",
      data: transaction,
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
