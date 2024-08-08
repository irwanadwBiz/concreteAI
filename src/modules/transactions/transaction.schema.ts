import * as z from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { TransactionStatus, CurrencyType } from "@prisma/client"; // Importing the enum from the generated Prisma client

export const TransactionInputSchema = z.object({
  paymentAccountId: z.string(),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .min(0.01, "Amount must be greater than zero"),
  currency: z.nativeEnum(CurrencyType),
  toAddress: z.string().optional(),
});

export const TransactionResponseSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.nativeEnum(CurrencyType),
  toAddress: z.string().optional(),
  status: z.nativeEnum(TransactionStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TransactionInput = z.infer<typeof TransactionInputSchema>;
export type TransactionOutput = z.infer<typeof TransactionResponseSchema>;

export const { schemas: transactionSchemas, $ref } = buildJsonSchemas(
  {
    TransactionInputSchema,
    TransactionResponseSchema,
  },
  { $id: "TransactionSchema" }
);
