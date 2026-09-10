import * as z from "zod"

export const loginFormSchema = z.object({
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  password: z
    .string()
    .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" })
    .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: "يجب أن تحتوي كلمة المرور على حرف كبير وصغير ورقم أو رمز خاص",
    }),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
