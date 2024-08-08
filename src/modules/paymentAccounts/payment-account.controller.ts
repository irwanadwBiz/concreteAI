import { FastifyReply, FastifyRequest } from "fastify";
import * as PaymentAccountService from "./payment-account.service";
import {
  CreatePaymentAccountInput,
  UpdatePaymentAccountInput,
  PaymentAccountParams,
} from "./payment-account.schema";

export async function createPaymentAccountHandler(
  request: FastifyRequest<{ Body: CreatePaymentAccountInput }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const { id } = request.user;
  try {
    const payload = {
      userId: id,
      ...request.body,
    };
    const data = await PaymentAccountService.createPaymentAccount(id, payload);
    return reply.status(201).send({
      status: 201,
      message: "Payment Account Successfully created",
      data: data,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Internal Server Error",
      error: error.message, // It's usually better to log the real error and send a generic message to the client, unless it's a user-friendly message like above.
    });
  }
}

export async function getMyAccountHandler(
  request: FastifyRequest<{ Params: PaymentAccountParams }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const payload = request.user;
  try {
    const account = await PaymentAccountService.getMyAccount({
      userId: payload.id,
    });
    return reply.status(200).send({
      status: 200,
      message: "User Account Successfully fetched",
      data: account,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Internal Server Error",
      error: error.message, // It's usually better to log the real error and send a generic message to the client, unless it's a user-friendly message like above.
    });
  }
}

export async function updatePaymentAccountHandler(
  request: FastifyRequest<{
    Params: PaymentAccountParams;
    Body: UpdatePaymentAccountInput;
  }>,
  reply: FastifyReply
) {
  const account = await PaymentAccountService.updatePaymentAccount(
    request.params.id,
    request.body
  );
  return reply.send(account);
}

export async function deletePaymentAccountHandler(
  request: FastifyRequest<{ Params: PaymentAccountParams }>,
  reply: FastifyReply
) {
  await PaymentAccountService.deletePaymentAccount(request.params.id);
  return reply.code(204).send();
}
