import { z } from "zod";

export const QueryUserSchema = z.object({
  username: z.string().optional(),
});
