import { z } from "zod";

export const AuthRegisterSchema = z
  .object({
    username: z.string().min(5),
    password: z.string().min(6),
    email: z.string().email(),
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const isUppercase = (char: string) => /[A-Z]/.test(char);
    const isLowercase = (char: string) => /[a-z]/.test(char);
    const isSpecialCharacter = (char: string) =>
      /[`,.<>\/?~!@$#^&*()_\-+=\[\]{};':"\\| ]/.test(char);
    const isNumerical = (char: string) => /\d/.test(char);

    interface Requirement {
      label: string;
      minimum: number;
      value: number;
      handler: (char: string) => boolean;
    }

    const requirements: Requirement[] = [
      {
        value: 0,
        label: "Upper Case",
        minimum: 1,
        handler: isUppercase,
      },
      {
        value: 0,
        label: "Lower Case",
        minimum: 1,
        handler: isLowercase,
      },
      {
        value: 0,
        label: "Number",
        minimum: 1,
        handler: isNumerical,
      },
      {
        value: 0,
        label: "Special Character",
        minimum: 1,
        handler: isSpecialCharacter,
      },
    ];

    for (let i = 0; i < password.length; i++) {
      let char = password[i];
      for (let j = 0; j < requirements.length; j++) {
        const requirement = requirements[j];

        if (requirement.handler(char)) {
          requirement.value++;
        }
      }
    }

    for (const reqirement of requirements) {
      if (reqirement.value < reqirement.minimum) {
        checkPassComplexity.addIssue({
          code: "custom",
          message:
            "password does not meet complexity requirements, missing " +
            reqirement.label,
        });

        break;
      }
    }
  });

export const AuthLoginSchema = z.object({
  username: z.string().min(5),
  password: z.string().min(6),
});
