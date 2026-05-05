import { PostContentProps } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formateDate } from "@/lib/utils";

import Link from "next/link";
import { Delete, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import DeleteButtonPost from "./delete-button-post";

export default function PostContent({ post, isAuthor }: PostContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">{post?.title}</CardTitle>
        <CardDescription>
          By {post?.author.name} - {formateDate(post?.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-lg mb-6">{post.description}</p>
        <p className="text-foreground text-4xl font-bold mb-6">
          {post.content}
        </p>
      </CardContent>
      {isAuthor && (
        <CardFooter className="flex gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/post/edit/${post.slug}`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <DeleteButtonPost postId={post.id} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
