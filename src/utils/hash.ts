import { hashSync } from "bcrypt";

export const hash = (s: string) => hashSync(s, 10);
