"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { useState } from "react"

export function DeleteModal({
    title,
    desc,
    pass,
    onClick
}) {
    const [keyword, setKeyword] = useState("")
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Trash2 color="red" className="cursor-pointer" />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {desc}
                    </AlertDialogDescription>
                    <p>To delete: Type <b>{pass}</b> in the input field.</p>
                    <Input
                        className="w-full"
                        placeholder="Keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {keyword === pass && (
                        <AlertDialogAction onClick={onClick}>Delete</AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
