import { Request, Response } from "express";
import { QueryUserSchema } from "~schemas/UserSchema";
import prisma from "~utils/database";

export const GetUsers = async (req: Request, res: Response) => {
  try {
    const query = QueryUserSchema.parse({
      username: req.query["username"],
    });

    const users = await prisma.user.findMany({
      ...(query.username
        ? {
            where: {
              username: {
                search: query.username,
              },
            },
          }
        : {}),
      select: {
        id: true,
        username: true,
        email: true,
        updatedAt: true,
        createdAt: true,
        validTokens: false,
        password: false,
        tasks: false,
      },
    });

    return res.status(200).json(users); // Get Users
  } catch (e) {
    return res.status(500).send(); // Server error
  }
};
