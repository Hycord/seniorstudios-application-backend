import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { AuthRegisterSchema } from "~schemas/AuthSchema";
import prisma from "~utils/database";

export const AuthRegister = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = AuthRegisterSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).send(error.message); // Malformed Data
    }

    try {
      // Attempt to create the user.
      // Fail for already existing user because we would have failed before if data was malformed.
      await prisma.user.create({
        data,
      });
      return res.status(201).send(); // User created
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
        // P2022: Unique constraint failed
        if (e.code === "P2002") {
          return res.status(409).send(); // User Already Exists
        }
      }
      return res.status(500).send(); // Server Error
    }
  } catch (e) {
    return res.status(500).send(); // Server Error
  }
};
