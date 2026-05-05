"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { slugify } from "../lib/utils";
import { db } from "@/lib/db";
import { and, eq, ne } from "drizzle-orm";
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
    console.log(e, "Failed to Add post");
    return {
      success: false,
      message: "failed to create post",
    };
  }
}

export async function updatePostAction(postId: number, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return {
        success: false,
        message: "you must be logged in to update a post",
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
      where: and(eq(posts.slug, slug), ne(posts.id, postId)),
    });

    if (existingPost) {
      return {
        success: false,
        message: "a post with this title already exists",
      };
    }
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });
    if (post?.authorId !== session?.user?.id) {
      return {
        success: false,
        message: "you are not authorized to update this post",
      };
    }
    await db
      .update(posts)
      .set({
        title,
        description,
        content,
        slug,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));
    revalidatePath("/");
    revalidatePath(`/post/${slug}`);
    revalidatePath("/profile");
    return {
      success: true,
      message: "post updated successfully",
      slug,
    };
  } catch (e) {
    console.log(e, "Failed to edit post");
    return {
      success: false,
      message: "failed to update post",
    };
  }
}

export async function deletePostAction(postId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return {
        success: false,
        message: "you must be logged in to delete a post",
      };
    }
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });
    if (post?.authorId !== session?.user?.id) {
      return {
        success: false,
        message: "you are not authorized to delete this post",
      };
    }
    await db.delete(posts).where(eq(posts.id, postId));

    revalidatePath("/");
    revalidatePath("/profile");

    return {
      success: true,
      message: "post deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "failed to delete post",
    };
  }
}
