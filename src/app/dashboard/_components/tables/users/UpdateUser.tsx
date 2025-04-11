"use client"

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUser } from "@/app/(authentication-pages)/_actions/auth";
import { ActionModal } from "../../widgets/ActionModal";
import { LoadingButton } from "../../widgets/Loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Suspense } from "react";
import Loading from "../../../loading";

const formSchema = z.object({
    role: z.string().min(3, {
        message: "Role is required",
    }),
    isActive: z.string().min(3, {
        message: "User access is required",
    }),
})


export default function UpdateUser() {
    const [open, setOpen] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const id = searchParams.get('id');
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: role,
            isActive: isActive,
        },
    })

    useEffect(() => {
        if (id) {
            setOpen(true);
            form.setValue("role", role);
            form.setValue("isActive", isActive);
        }
    }, [id, role, isActive, form]);

    useEffect(() => {
        if (!open) {
            router.replace("/dashboard/users");
        }
    }, [open, router]);

    const isLoading = form.formState.isSubmitting;

    async function onSubmit(values) {
        const { role, isActive } = values;
        console.log(values);
        const res = await updateUser({ role, isActive, id });
        if (res?.error) {
            toast.error(res?.error);
        }
        if (res?.message) {
            toast.success(res?.message);
        }
        form.reset();
        setOpen(false);
    }

    return (
        <Suspense fallback={<Loading />}>
            <div>
                <ActionModal
                    title={"Update User"}
                    desc={"Update user role and access"}
                    onClick={() => console.log("clicked")}
                    trigger={
                        <></>
                    }
                    open={open}
                    setOpen={setOpen}
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Change User Role</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select user role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="user">User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Change User Access</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="true">Has access</SelectItem>
                                                <SelectItem value="false">Has no access</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {
                                isLoading ? (
                                    <LoadingButton btnText={"Loading..."} btnClass={"w-full"} btnVariant={"default"} />
                                ) : (
                                    <Button type="submit" className="w-full">
                                        Update user
                                    </Button>
                                )
                            }
                        </form>
                    </Form>
                </ActionModal>
            </div>
        </Suspense>
    )
}
