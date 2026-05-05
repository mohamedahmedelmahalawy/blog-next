"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useTransition } from "react";

import { createPostAction, updatePostAction } from "@/actions/post-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(255, "Title must be less than 255 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .max(255, "Description must be less than 255 characters long"),

  content: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
});

interface PostFormProps {
  isEditing?: boolean;
  post?: {
    id: number;
    title: string;
    description: string;
    content: string;
    slug: string;
  };
}
type PostFormValues = z.infer<typeof postSchema>;
export default function PostForm({ isEditing, post }: PostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues:
      isEditing && post
        ? {
            title: post.title,
            description: post.description,
            content: post.content,
          }
        : {
            title: "",
            description: "",
            content: "",
          },
  });
  const onSubmitHandler = async (data: PostFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("content", data.content);

        let res;
        if (isEditing && post) {
          res = await updatePostAction(post.id, formData);
        } else {
          res = await createPostAction(formData);
          console.log(res, "res from action");
        }
        if (res.success) {
          toast(
            isEditing
              ? "Post updated successfully"
              : "Post created successfully",
          );
          router.refresh();
          router.push("/");
        } else {
          toast.error(res.message || "Failed to create post");
        }
      } catch (e) {
        toast.error("Failed to create post", {
          description: e instanceof Error ? e.message : "Something went wrong",
        });
      }
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6">
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel data-invalid={fieldState.invalid} htmlFor="title">
              Title
            </FieldLabel>
            <Input
              {...field}
              id="title"
              placeholder="Enter your title"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="space-y-2">
            <FieldLabel data-invalid={fieldState.invalid} htmlFor="description">
              Description
            </FieldLabel>
            <Input
              {...field}
              id="description"
              placeholder="Enter your description"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="space-y-2">
            <FieldLabel data-invalid={fieldState.invalid} htmlFor="content">
              Content
            </FieldLabel>
            <Textarea
              {...field}
              id="content"
              placeholder="Enter your content"
              aria-invalid={fieldState.invalid}
              className="min-h-62.5 resize-none"
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button className="mt-5 w-full" type="submit">
        {isPending
          ? "Saving Post..."
          : isEditing
            ? "Update Post"
            : "Create Post"}
      </Button>
    </form>
  );
}
