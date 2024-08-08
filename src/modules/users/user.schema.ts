import * as z from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { AccountType } from "@prisma/client"; // Importing the enum from the generated Prisma client

const accountSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(AccountType),
  balance: z.number(),
});

const userCore = {
  // define the common user schema
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email is not valid",
    })
    .email(),
  name: z.string(),
  accounts: z.array(accountSchema),
};

const createUserSchema = z.object({
  ...userCore, // re-use the userCore object
  password: z.string({
    required_error: "Password is required",
  }),
});

const createUserResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    ...userCore,
  }),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email is not valid",
    })
    .email(),
  password: z.string(),
});

const getProfileSchema = z.object({
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id is not valid",
  }),
});

const loginResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GetProfileInput = z.infer<typeof getProfileSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
});
