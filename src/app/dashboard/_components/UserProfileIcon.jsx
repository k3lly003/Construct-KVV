"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react'

export default function UserProfileIcon() {
    const { data: session } = useSession();
    return (
        <>
            <Avatar>
                <AvatarImage src={session?.user?.image} />
                <AvatarFallback>{session?.user?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
        </>
    )
}
