import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

import prisma from "~utils/database";

export const GetTask = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const task = await prisma.task.findFirstOrThrow({
      where: { id },
    });
    return res.status(200).json(task); // Task data
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
      // P2025: Not Found Error
      if (e.code === "P2025") {
        return res.status(400).send(); //  Malformed Data
      }
    }
    return res.status(500).send(); // Server Error
  }
};
