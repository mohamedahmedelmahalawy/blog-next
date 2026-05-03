"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { slugify } from "../lib/utils";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { posts } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function createPostAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session?.user) {
    return {
      success: false,
      message: "you must be logged in to create a post",
    };
  }
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;

  if (!title || !description || !content) {
    return {
      success: false,
      message: "all fields are required",
    };
  }
  const slug = slugify(title);

  const existingPost = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
  });

  if (existingPost) {
    return {
      success: false,
      message:
        "a post with this title already exists, please try with a different one",
    };
  }

  try {
    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        description,
        content,
        slug,
        authorId: session.user.id,
      })
      .returning();

    revalidatePath("/");
    revalidatePath(`/post/${slug}`);
    revalidatePath("/profile");

    return {
      success: true,
      message: "post created successfully",
      slug,
    };
  } catch (e) {
    return {
      success: false,
      message: "failed to create post",
    };
  }
}
