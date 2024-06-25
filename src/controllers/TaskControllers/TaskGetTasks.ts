import { Request, Response } from "express";
import { TaskSchema } from "~schemas/TaskSchema";

import prisma from "~utils/database";

export const GetTasks = async (req: Request, res: Response) => {
  try {
    const query = TaskSchema.safeParse({
      title: req.query["title"],
      description: req.query["description"],
      status: req.query["status"],
    });

    const tasks = await prisma.task.findMany({
      where: query.success
        ? {
            title: query.data.title ? { search: query.data.title } : undefined,
            description: query.data.description
              ? { search: query.data.description }
              : undefined,
            status: query.data.status
              ? { equals: query.data.status }
              : undefined,
          }
        : {},
    });

    return res.status(200).json(tasks); // List of tasks
  } catch (e) {
    return res.status(500).send(); // Server error
  }
};
