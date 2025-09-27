export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type FormStatus = "idle" | "loading" | "success" | "error";
