import PostContent from "@/components/post/post-content";
import { auth } from "@/lib/auth";
import { getPostBySlug } from "@/lib/db/queries";

import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface PostDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailsPage({
  params,
}: PostDetailsPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!post) {
    return notFound();
  }

  const isAuthor = session?.user?.id === post.authorId;
  return (
    <main className="py-10">
      <div className="max-w-4xl mx-auto">
        <PostContent post={post} isAuthor={isAuthor} />
      </div>
    </main>
  );
}
