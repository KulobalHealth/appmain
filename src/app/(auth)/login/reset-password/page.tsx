"use client"
import React, { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import Loader from '@/components/loader'
import toast from 'react-hot-toast'
import TextInput from '@/components/ui/text-input'

function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const { resetPassword, isLoading } = useAuthStore();
    const router = useRouter();

    const handleReset = async () => {
        if (!email) {
            toast.error("Missing email. Please try again from the beginning.");
            router.push("/login/forgot-password");
            return;
        }


        if (!newPassword) {
            toast.error("Please enter a new password.");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        const loadingToast = toast.loading("Resetting password...", { icon: "⏳" });
        
        try {
            // Since OTP was already verified on the verify-otp page, we pass empty string
            const result = await resetPassword(email, "", newPassword);
            toast.dismiss(loadingToast);
            
            if (result.success) {
                toast.success("Password reset successfully! You can now log in.", { icon: "✅" });
                router.push("/login");
            } else {
                toast.error(result.error || "Failed to reset password.");
            }
        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className="flex flex-col justify-center items-center w-full max-w-md bg-white p-8 ">
                {/* Icon */}
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-300">
                        <KeyRound className="text-green-800 w-6 h-6" />
                    </div>
                </div>

                {/* Heading and Subtext */}
                <h1 className="text-2xl font-semibold mb-2">Reset Password</h1>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Set a new password for your account
                </p>

                {/* Form Fields */}
                <div className="w-full space-y-4 mb-6">
                    <TextInput
                        label="New Password"
                        placeholder="Enter new password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextInput
                        label="Confirm Password"
                        placeholder="Confirm new password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {/* Button */}
                <Button 
                    variant="default" 
                    size="lg" 
                    className="w-full mb-4" 
                    onClick={handleReset}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader /> : "Reset Password"}
                </Button>

                {/* Back to login */}
                <p className="flex items-center gap-2 text-sm text-gray-500">
                    <ArrowLeft className="w-4 h-4" />
                    <Link href="/login">Back to login</Link>
                </p>
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen">
                <Loader />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
