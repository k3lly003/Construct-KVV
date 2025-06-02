import z from "zod";

export const loginValidation = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" }),
  password: z
    .string()
    .nonempty({ message: "Password is required" })

})