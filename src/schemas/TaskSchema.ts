import { z } from "zod";

const title = z.string().min(1);
const description = z.string().min(1);
const status = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]);

export const TaskSchema = z.object({
  title: title.optional(),
  description: description.optional(),
  status: status.optional(),
});

export const CreateTaskSchema = z.object({
  title,
  description,
  status: status.optional(),
});
