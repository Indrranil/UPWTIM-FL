import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DEPARTMENTS } from "@/lib/constants";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Define schemas for login and registration
const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .refine((email) => email.endsWith("@mitwpu.edu.in"), {
      message: "Only MIT-WPU email addresses are allowed",
    }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z
      .string()
      .email("Please enter a valid email")
      .refine((email) => email.endsWith("@mitwpu.edu.in"), {
        message: "Only MIT-WPU email addresses are allowed",
      }),
    department: z.string().min(1, "Please select your department"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  type: "login" | "register";
  verifiedEmail?: string;
  prefilledData?: RegisterFormValues;
  onUserInfoSubmit?: (data: RegisterFormValues) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  verifiedEmail,
  prefilledData,
  onUserInfoSubmit,
}) => {
  const { login, register: registerUser, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: prefilledData || {
      name: "",
      email: verifiedEmail || "",
      department: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    const success = await login({
      email: values.email,
      password: values.password,
    });
    if (success) {
      navigate("/");
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    if (onUserInfoSubmit) {
      onUserInfoSubmit(values);
      return;
    }

    const success = await registerUser({
      name: values.name,
      email: values.email,
      department: values.department,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
    if (success) {
      navigate("/");
    }
  };

  const currentForm = type === "login" ? loginForm : registerForm;
  const onSubmit = type === "login" ? onLoginSubmit : onRegisterSubmit;

  return (
    <div
      className={
        type === "register"
          ? ""
          : "w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
      }
    >
      {type === "login" && (
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to Your Account
        </h2>
      )}

      <Form {...currentForm}>
        <form
          onSubmit={currentForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {type === "register" && (
            <FormField
              control={registerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={currentForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your MIT-WPU email"
                    {...field}
                    disabled={
                      type === "register" &&
                      (!!verifiedEmail || !!prefilledData)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === "register" && (
            <FormField
              control={registerForm.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!!prefilledData}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEPARTMENTS.map((department) => (
                        <SelectItem
                          key={department.value}
                          value={department.value}
                        >
                          {department.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={currentForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === "register" && (
            <FormField
              control={registerForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="w-full bg-mitwpu-navy hover:bg-mitwpu-navy/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === "login"
                  ? "Logging in..."
                  : onUserInfoSubmit
                    ? "Continue"
                    : "Register"}
              </>
            ) : type === "login" ? (
              "Login"
            ) : onUserInfoSubmit ? (
              "Continue"
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </Form>

      {type === "login" && (
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-mitwpu-maroon hover:underline">
              Register
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
