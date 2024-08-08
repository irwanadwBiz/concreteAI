import * as z from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { AccountType } from "@prisma/client"; // Importing the enum from the generated Prisma client

export const createPaymentAccountSchema = z.object({
  type: z.nativeEnum(AccountType),
  balance: z.number(),
});

export const paymentAccountParamsSchema = z.object({
  id: z.string(),
});

export const paymentAccountResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: createPaymentAccountSchema,
});

const getAccountInput = z.object({
  userId: z.string({
    required_error: "userId is required",
    invalid_type_error: "userId is not valid",
  }),
});

export const updatePaymentAccountSchema = createPaymentAccountSchema.partial();

export type CreatePaymentAccountInput = z.infer<
  typeof createPaymentAccountSchema
>;
export type UpdatePaymentAccountInput = z.infer<
  typeof updatePaymentAccountSchema
>;
export type PaymentAccountParams = z.infer<typeof paymentAccountParamsSchema>;

export type GetAccountInput = z.infer<typeof getAccountInput>;

export const { schemas: accountSchemas, $ref } = buildJsonSchemas(
  {
    createPaymentAccountSchema,
    paymentAccountResponseSchema,
    updatePaymentAccountSchema,
    paymentAccountParamsSchema,
  },
  { $id: "AccountSchema" }
);
