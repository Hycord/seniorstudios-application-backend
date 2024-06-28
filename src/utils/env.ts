import EnvironmentSchema from "~schemas/EnvironmentSchema";

const env = EnvironmentSchema.safeParse(process.env);

if (!env.success) {
  throw new Error(
    `Invalid environment variables. [\n${env.error.issues
      .map((issue) => `\t(${issue.code} @ ${issue.path}): ${issue.message}`)
      .join(",\n")}\n]`
  );
}

export default env.data;
