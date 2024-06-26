import { NextFunction, Request, Response } from "express";
import morgan from "morgan";

export default async (req: Request, res: Response, next: NextFunction) => {
  morgan("dev")(req, res, next); // For now we just pass the data to morgan but this is where we would add extra logging if needed.
};
