import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginInput } from "./user.schema";
import { createUser, getProfile, loginUser } from "./user.service";

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);
    return reply.status(201).send({
      status: 201,
      message: "User Successfully Registered",
      data: user,
    });
  } catch (error) {
    console.error(error);
    // Handle specific known error
    if (error.message === "Email already exists") {
      return reply
        .status(409)
        .send({ message: "Internal Server Error", error: error.message });
    }

    // Handle any other errors
    return reply.status(500).send({
      message: "Internal Server Error",
      error: error.message, // It's usually better to log the real error and send a generic message to the client, unless it's a user-friendly message like above.
    });
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const { payload } = await loginUser(body);
    const token = request.jwt.sign(payload);
    reply.setCookie("access_token", token, {
      path: "/",
      maxAge: 604800, // 7 days in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure cookie in production
    });

    return reply.status(201).send({
      status: 200,
      message: "User Successfully login",
      data: token,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Internal Server Error",
      error: error.message, // It's usually better to log the real error and send a generic message to the client, unless it's a user-friendly message like above.
    });
  }
}

export async function getProfileHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const payload = request.user;
  try {
    const { password, salt, ...rest } = await getProfile({ id: payload.id });

    return reply.status(201).send({
      status: 200,
      message: "User Successfully login",
      data: rest,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Internal Server Error",
      error: error.message, // It's usually better to log the real error and send a generic message to the client, unless it's a user-friendly message like above.
    });
  }
}
