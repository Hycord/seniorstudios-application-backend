import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { TaskSchema } from "~schemas/TaskSchema";
import prisma from "~utils/database";

export const GetUserTasks = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const query = TaskSchema.safeParse({
      title: req.query["title"],
      description: req.query["description"],
      status: req.query["status"],
    });

    const user = await prisma.user.findFirstOrThrow({
      where: { id },
      include: {
        tasks: query.success
          ? {
              where: {
                title: query.data.title
                  ? { search: query.data.title }
                  : undefined,
                description: query.data.description
                  ? { search: query.data.description }
                  : undefined,
                status: query.data.status
                  ? { equals: query.data.status }
                  : undefined,
              },
            }
          : true,
      },
    });
    return res.status(200).json(user.tasks); // List of tasks
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
      // P2025: Not Found Error
      if (e.code === "P2025") {
        return res.status(400).send(); // Invalid user ID
      }
    }

    return res.status(500).send(); // Server error
  }
};
