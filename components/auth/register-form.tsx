"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";

const registerSchema = z
  .object({
    name: z.string().min(3, { message: "Name must be 3 characters long." }),
    email: z.string().email({ error: "Please enter a valid email address!" }),
    password: z
      .string()
      .min(6, { message: "Password must be 6 characters long." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be 6 characters long." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
}
export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (error) {
        toast.error(
          "Registration failed to create an account. Please try again.",
        );
      }
      console.log(error);
      toast(
        "Registration successful! Please check your email to verify your account.",
      );
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={form.handleSubmit(onRegisterSubmit)} className="space-y-4">
      {/* Name */}
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              {...field}
              id="name"
              placeholder="Enter your Name"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {/* email */}
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...field}
              id="email"
              placeholder="Enter your Email"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {/* password */}
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              {...field}
              type="password"
              id="password"
              placeholder="Enter your Password"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {/* confirm password */}
      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Input
              {...field}
              type="password"
              id="confirmPassword"
              placeholder="Confirm your Password"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Account" : "Create Account"}
      </Button>
    </form>
  );
}
