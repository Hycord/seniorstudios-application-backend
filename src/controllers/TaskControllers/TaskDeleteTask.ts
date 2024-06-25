import { Prisma, Task } from "@prisma/client";
import { Request, Response } from "express";

import prisma from "~utils/database";

export const DeleteTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const tasks = res.locals.tasks as Task[];

    if (!tasks.map((t) => t.id).includes(id)) {
      return res.status(403); // No access
    }

    const task = await prisma.task.delete({
      where: {
        id,
      },
    });

    return res.status(200).json(task); // Task deleted successfully
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
      // P2025: Not Found Error
      if (e.code === "P2025") {
        return res.status(404).send(); // Invalid task ID
      }
    }
    return res.status(500).send(); // Server Error
  }
};
