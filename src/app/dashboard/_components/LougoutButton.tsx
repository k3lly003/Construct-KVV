"use client"

import { signOut } from "next-auth/react";

export default function LougoutButton() {
    return (
        <button
            type="button"
            onClick={() => { signOut({ callbackUrl: "/auth/login" }) }}
        >
            Logout
        </button>
    )
}
