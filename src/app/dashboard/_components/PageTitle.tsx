import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string,
  className: string
}
export default function PageTitle({ title, className }:PageTitleProps) {
  return (
    <h2 className={cn("text-2xl font-semibold", className)}>{title}</h2>
  )
}
