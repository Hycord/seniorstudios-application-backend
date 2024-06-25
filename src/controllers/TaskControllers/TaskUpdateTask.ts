import { Prisma, Task } from "@prisma/client";
import { Request, Response } from "express";
import { TaskSchema } from "~schemas/TaskSchema";

import prisma, { LocalUser } from "~utils/database";

export const UpdateTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = res.locals.user as LocalUser;
    const tasks = res.locals.tasks as Task[];

    const { success, error, data } = TaskSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).send(error.message); // Malformed Data
    }
    const { description, status, title } = data;

    if (!tasks.map((t) => t.id).includes(id)) {
      return res.status(403); // No access
    }

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        description: description ?? undefined,
        status: status ?? undefined,
        title: title ?? undefined,
      },
    });

    return res.status(200).json(task); // Updated Task
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
      // P2025: Not Found Error
      if (e.code === "P2025") {
        return res.status(404).send(); // Invalid task ID
      }
    }
    return res.status(500).send();
  }
};
