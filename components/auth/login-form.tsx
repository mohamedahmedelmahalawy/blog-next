"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "../ui/button";

const loginSchema = z.object({
  email: z.string().email({ error: "please enter a valid email value" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      console.log(data);
    } catch (error) {}
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* EMAIL */}
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">Email</FieldLabel>

            <Input
              {...field}
              id="email"
              placeholder="Enter your email"
              aria-invalid={fieldState.invalid}
            />

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {/* PASSWORD */}
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">Password</FieldLabel>

            <Input
              {...field}
              id="password"
              type="password"
              placeholder="Enter your password"
              aria-invalid={fieldState.invalid}
            />

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
