import { PrismaClient } from "@prisma/client";
import {
  CreatePaymentAccountInput,
  GetAccountInput,
  UpdatePaymentAccountInput,
} from "./payment-account.schema";
const prisma = new PrismaClient();

export async function createPaymentAccount(
  userId: string,
  data: CreatePaymentAccountInput
) {
  // Ensure that the type is correctly cast to the AccountType enum
  return await prisma.paymentAccount.create({
    data: {
      userId: userId,
      type: data.type, // Ensure this matches the AccountType enum
      balance: data.balance,
    },
  });
}

export async function getMyAccount(input: GetAccountInput) {
  return await prisma.paymentAccount.findMany({
    where: { userId: input.userId },
  });
}

export async function updatePaymentAccount(
  id: string,
  data: UpdatePaymentAccountInput
) {
  return await prisma.paymentAccount.update({
    where: { id },
    data,
  });
}

export async function deletePaymentAccount(id: string) {
  return await prisma.paymentAccount.delete({
    where: { id },
  });
}
