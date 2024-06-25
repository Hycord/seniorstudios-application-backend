import { Prisma, PrismaClient, User } from "@prisma/client";
import { hash } from "~utils/hash";

const globalPrisma = global as typeof global & { prisma?: PrismaClient };

if (!globalPrisma.prisma) {
  globalPrisma.prisma = new PrismaClient().$extends({
    query: {
      user: {
        findUniqueOrThrow({ args, query }) {
          if (args.where["password"]) {
            args.where["password"] = hash(args.where["password"]); // Automatically hash passwords so I don't need to pipe around bcrypt
          }
          return query(args);
        },
        create({ args, query }) {
          if (args.data["password"]) {
            args.data["password"] = hash(args.data["password"]); // Automatically hash passwords so I don't need to pipe around bcrypt
          }
          return query(args);
        },
      },
    },
  }) as PrismaClient;
}

export type LocalUser = Awaited<
  Prisma.Prisma__UserClient<
    {
      validTokens: {
        jwtid: string;
        userId: string | null;
      }[];
    } & User
  >
>;

const prisma = globalPrisma.prisma;

export default prisma;
