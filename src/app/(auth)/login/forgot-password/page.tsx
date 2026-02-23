"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import TextInput from '@/components/ui/text-input'
import { ArrowLeft, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Helper from '@/components/auth-page-helper'
import { useAuthStore } from '@/store/auth-store'
import Loader from '@/components/loader'
import toast from 'react-hot-toast'

export default function ForgetPassword() {
    const [email, setEmail] = useState<string>("");
    const { forgotPassword, isLoading } = useAuthStore();
    const router = useRouter();

    const handleForgot = async () => {
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }

        const loadingToast = toast.loading("Sending reset instructions...", { icon: "⏳" });
        
        try {
            const result = await forgotPassword(email);
            toast.dismiss(loadingToast);
            
            if (result.success) {
                toast.success("Reset instructions sent to your email!", { icon: "✅" });
                // Redirect to OTP verification page with email and reset parameters
                router.push(`/verify-otp?email=${encodeURIComponent(email)}&reset=true`);
            } else {
                toast.error(result.error || "Failed to send reset instructions.");
            }
        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error("Failed to send reset instructions. Please try again.");
        }
    }
    
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center w-full max-w-md bg-white p-9 ">

                {/* Icon */}
                <Helper
                    icon={<KeyRound className="text-green-800 w-6 h-6" />
} 
                />
               
                {/* Heading & Description */}
                <h1 className="text-2xl font-semibold mb-2">Forgot Password</h1>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Don’t worry, we’ll send you reset instructions.
                </p>

                {/* Input */}
                <div className="w-full mb-4">
                    <TextInput
                        label="Email/Phone Number"
                        placeholder="Enter email/phone number"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Button */}
                <Button variant="default" size="lg" className="w-full mb-4" onClick={handleForgot} disabled={isLoading}>
                    {isLoading ? <Loader /> : "Reset Password"}
                </Button>

                {/* Back to Login */}
                <p className="flex items-center gap-2 text-sm text-gray-500">
                    <ArrowLeft className="w-4 h-4" />
                    <Link href="/login">Back to login</Link>
                </p>
            </div>
        </div>
    );
}
