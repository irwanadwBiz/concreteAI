import { db } from "../../utils/prisma";
import { TransactionInput } from "./transaction.schema";
import { Transaction } from "../../models/interfaces/transaction";

import { PrismaClient, TransactionStatus } from "@prisma/client";
const prisma = new PrismaClient();

export async function createTransaction(
  userId: string,
  input: TransactionInput
) {
  const paymentAccount = await prisma.paymentAccount.findUnique({
    where: { id: input.paymentAccountId },
  });

  if (!paymentAccount) {
    throw new Error("Invalid payment account");
  }

  if (paymentAccount.balance < input.amount) {
    throw new Error("Insufficient balance");
  }

  // Create the transaction with initial status "pending"
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      paymentAccountId: input.paymentAccountId,
      amount: input.amount,
      currency: input.currency,
      toAddress: input.toAddress,
      status: TransactionStatus.pending,
    },
  });

  console.log("Created transaction:", transaction);

  const isSuccess = await processTransaction(transaction);

  if (isSuccess) {
    // Transaction success: update to 'success' and adjust balance
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: "success" },
    });
    await prisma.paymentAccount.update({
      where: { id: input.paymentAccountId },
      data: { balance: paymentAccount.balance - input.amount },
    });
    transaction.status = "success";
    console.log("Transaction processed successfully for:", transaction);
  } else {
    // Transaction failure: update to 'failed'
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: "failed" },
    });
    transaction.status = "failed";
    console.log("Transaction processing failed for:", transaction);
  }

  return transaction;
}

async function processTransaction(transaction: Transaction): Promise<boolean> {
  return new Promise((resolve) => {
    console.log("Transaction processing started for:", transaction);

    // Simulate a long-running process
    setTimeout(() => {
      // Randomly determine if the transaction should succeed or fail
      const isSuccess = Math.random() > 0.5; // 50% chance of success

      resolve(isSuccess); // Resolve with the success status
    }, 10000); // Simulates a delay of 10 seconds
  });
}
