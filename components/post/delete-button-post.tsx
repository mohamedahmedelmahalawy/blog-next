"use client";

import { DeletePostButtonProps } from "@/lib/types";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deletePostAction } from "@/actions/post-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteButtonPost({ postId }: DeletePostButtonProps) {
  const [isDeleteing, setIsDeleting] = useState(false);
  const router = useRouter();
  const handleDelete = async (postId: number) => {
    setIsDeleting(true);
    try {
      const res = await deletePostAction(postId);
      if (res.success) {
        toast.success(res.message);
        router.push("/");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error("Failed to create post", {
        description: e instanceof Error ? e.message : "Something went wrong",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => handleDelete(postId)}
      disabled={isDeleteing}
    >
      <Trash2 className="h-4 w-4 mr-2" />
      Delete
    </Button>
  );
}
