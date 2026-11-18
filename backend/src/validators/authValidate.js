import yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: yup
    .string()
    .oneOf(["buyer", "seller"], "Please select a valid account type")
    .required("Account type is required"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().trim().required("Password is required"),
});
