"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIsLoading(false)
        setIsSubmitted(true)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f1e8] px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <Link
                    href="/login"
                    className="flex items-center gap-2 text-small text-zinc-700 hover:text-amber-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Link>

                <Card className="border-zinc-200 bg-white shadow-sm">
                    {!isSubmitted ? (
                        <>
                            <CardHeader className="space-y-6 items-center text-center pb-6">
                                <div className="space-y-2">
                                    <CardTitle className="text-title font-bold text-zinc-900">Forgot Password?</CardTitle>
                                    <CardDescription className="text-zinc-600">
                                        Enter your email address and we'll send you a reset link
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-6 mb-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-zinc-700 font-medium">
                                            Email address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                                        />
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-col gap-4">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-amber-500 text-white hover:bg-amber-600 font-semibold h-12 text-base"
                                    >
                                        {isLoading ? "Sending..." : "Send Reset Link"}
                                    </Button>

                                    <p className="text-small text-zinc-600 text-center">
                                        Remember your password?{" "}
                                        <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
                                            Sign in
                                        </Link>
                                    </p>
                                </CardFooter>
                            </form>
                        </>
                    ) : (
                        <>
                            <CardHeader className="space-y-6 items-center text-center pb-4">
                                <div className="rounded-full bg-amber-100 p-4">
                                    <CheckCircle2 className="h-8 w-8 text-amber-600" />
                                </div>
                                <div className="space-y-2">
                                    <CardTitle className="text-title font-bold text-zinc-900">Check your email</CardTitle>
                                    <CardDescription className="text-zinc-600">We've sent a password reset link to</CardDescription>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 text-center">
                                <p className="text-zinc-900 font-medium">{email}</p>
                                <p className="text-small text-zinc-600">
                                    Didn't get the email?{" "}
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="text-amber-600 hover:text-amber-700 font-medium"
                                    >
                                        Resend
                                    </button>
                                </p>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-4 pt-2">
                                <Button
                                    onClick={() => setIsSubmitted(false)}
                                    className="w-full bg-amber-500 text-white hover:bg-amber-600 font-semibold h-12 text-base"
                                >
                                    Try Another Email
                                </Button>

                                <p className="text-small text-zinc-600 text-center">
                                    Enter your email and you'll be redirected automatically once verified.
                                </p>
                            </CardFooter>
                        </>
                    )}
                </Card>

                <p className="text-small text-zinc-600 text-center">
                    Having trouble?{" "}
                    <Link href="/support" className="text-amber-600 hover:text-amber-700 font-medium">
                        Contact support
                    </Link>
                </p>
            </div>
        </div>
    )
}
