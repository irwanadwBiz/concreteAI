import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();

async function updatePendingTransactions() {
  const transactions = await prisma.transaction.findMany({
    where: { status: "pending" },
  });

  for (const transaction of transactions) {
    const paymentAccount = await prisma.paymentAccount.findUnique({
      where: { id: transaction.paymentAccountId },
    });

    if (!paymentAccount) {
      throw new Error("Invalid payment account");
    }

    if (paymentAccount.balance < transaction.amount) {
      throw new Error("Insufficient balance");
    }
    const updatedStatus = Math.random() > 0.5 ? "success" : "failed"; // Simulate transaction update
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: updatedStatus },
    });
    console.log(`Transaction ${transaction.id} updated to ${updatedStatus}`);
  }
}

export function startTransactionUpdateScheduler() {
  //every on hour
  cron.schedule("0 * * * *", updatePendingTransactions, {
    scheduled: true,
    timezone: "UTC",
  });
  console.log("Transaction update scheduler started.");
}
