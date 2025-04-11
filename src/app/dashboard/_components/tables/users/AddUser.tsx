"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { addUser } from "../../../_actions/userActions"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { toast } from "sonner"
import { LoadingButton } from "../../widgets/Loader"

const FormSchema = z.object({
    name: z.string().min(2, { message: "Name is required." }),
    email: z.string().min(2, { message: "Email is required." }),
    role: z.string().min(2, { message: "Role is required." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

export default function AddUser() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "",
        },
    })

    async function onSubmit(data) {
        const res = await addUser(data)
        if (res?.error) {
            toast.error(res?.error);
        }
        if (res?.message) {
            toast.success(res?.message);
            form.reset();
        }
    }

    const isLoading = form.formState.isSubmitting;

    return (
        <Dialog>
            <DialogTrigger>
                <Button>Add User</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4">
                                <div className="wflex flex-col space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Email address" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="user">Other User</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex w-full justify-between items-center">
                                                    Password
                                                    <div className="flex gap-2 items-center">
                                                        <Checkbox id="Show password" name={"isPasswordVisible"} onClick={() => { setIsPasswordVisible(!isPasswordVisible) }} />
                                                        <label htmlFor="Show password">View password</label>
                                                    </div>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type={isPasswordVisible ? "text" : "password"} placeholder="Your password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {isLoading ? (
                                    <LoadingButton btnText={"Loading..."} btnClass={"w-full"} btnVariant={"default"} />
                                ) : (
                                    <Button type="submit" className="w-full" >
                                        Submit
                                    </Button>
                                )}
                            </form>
                        </Form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
