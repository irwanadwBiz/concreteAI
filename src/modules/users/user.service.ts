import { hashPassword, verifyPassword } from "../../utils/hash";
import { db } from "../../utils/prisma";
import { CreateUserInput, GetProfileInput, LoginInput } from "./user.schema";

export async function createUser(input: CreateUserInput) {
  const { password, email, ...rest } = input;

  // Check if a user with the same email already exists
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // If no existing user, proceed to create a new one
  const { hash, salt } = hashPassword(password);

  const user = await db.user.create({
    data: { email, ...rest, salt, password: hash },
  });

  return user;
}

export async function loginUser(input: LoginInput) {
  const user = await db.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new Error("Invalid email address. Try again!");
  }

  const isValidPassword = verifyPassword({
    candidatePassword: input.password,
    salt: user.salt,
    hash: user.password,
  });

  if (!isValidPassword) {
    throw new Error("Password is incorrect");
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  return {
    user,
    payload,
  };
}

export async function getProfile(input: GetProfileInput) {
  const user = await db.user.findUnique({
    where: { id: input.id },
  });

  if (!user) {
    throw new Error("Invalid user");
  }
  return user;
}
