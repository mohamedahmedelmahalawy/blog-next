import { clsx, type ClassValue } from "clsx";
import { text } from "stream/consumers";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLocaleLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/ +/g, "-");
}

export function formateDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
