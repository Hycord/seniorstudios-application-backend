import { Request, Response } from "express";
import { CreateTaskSchema } from "~schemas/TaskSchema";

import prisma, { LocalUser } from "~utils/database";

export const CreateTask = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = CreateTaskSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).send(error.message); // Malformed Data
    }
    const { description, status, title } = data;

    const user = res.locals.user as LocalUser;

    const task = await prisma.task.create({
      data: {
        description,
        status: status,
        title,
        User: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return res.status(201).json(task); // Task Created
  } catch (e) {
    return res.status(500).send(); // Server Error
  }
  return res.status(500).send(); // Server Error
};
