import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export type ClassValue = string | number | ClassArray | undefined | null | false;
export type ClassArray = ClassValue[];

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}