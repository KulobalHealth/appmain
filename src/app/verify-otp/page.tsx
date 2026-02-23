"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MailIcon, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth-store";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

function OTPVerificationComponent() {
  const [otpValue, setOtpValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { verifyOtp, resendVerificationEmail, isLoading } = useAuthStore();
  const router = useRouter();
  
  // Determine if this is for password reset or registration
  const isPasswordReset = searchParams.get("reset") === "true";

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    
    const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Missing email for verification.");
      router.push("/signup");
      return;
    }
    
    if (otpValue.length !== 4) {
      toast.error("Please enter the complete 4-digit code.");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Verifying code...", { icon: "⏳" });
    
    try {
      const result = await verifyOtp(email, otpValue);
      toast.dismiss(loadingToast);
      
      if (result.success) {
        if (isPasswordReset) {
          toast.success("Code verified successfully! You can now reset your password.", { icon: "✅" });
          router.push(`/login/reset-password?email=${encodeURIComponent(email)}`);
        } else {
          toast.success("Email verified successfully! You can now log in.", { icon: "✅" });
          router.push(`/login`);
        }
      } else {
        toast.error(result.error || "Invalid code. Please try again.");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error?.message || "Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    if (!email) {
      toast.error("Missing email to resend code.");
      router.push("/signup");
      return;
    }
    
    try {
      const result = await resendVerificationEmail(email);
      
      if (result.success) {
        toast.success("A new verification code has been sent to your email.");
        setResendCooldown(30);
      } else {
        toast.error(result.error || "Failed to resend verification code.");
      }
    } catch (error: any) {
      toast.error("Failed to resend verification code. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* Icon */}
      <div className="mb-6 bg-emerald-100 rounded-full p-5">
        <MailIcon className="text-emerald-600 w-10 h-10" />
      </div>
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
        {isPasswordReset ? "Verify Reset Code" : "OTP Verification"}
      </h1>
      <p className="text-base sm:text-lg text-gray-600 mb-8 text-center leading-relaxed">
        We sent a {isPasswordReset ? "reset" : "verification"} code to
        <br />
        <span className="font-semibold text-gray-800">{email || "your email"}</span>
        <br />
        <span className="text-sm text-gray-500 mt-2 block">Enter the 4-digit code and click "Verify OTP"</span>
      </p>
      {/* OTP Input */}
      <InputOTP
        maxLength={4}
        value={otpValue}
        onChange={setOtpValue}
        className="scale-110"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} className="w-14 h-14 sm:w-20 sm:h-20 border-slate-200 focus:border-emerald-500" />
          <InputOTPSlot index={1} className="w-14 h-14 sm:w-20 sm:h-20 border-slate-200 focus:border-emerald-500" />
          <InputOTPSlot index={2} className="w-14 h-14 sm:w-20 sm:h-20 border-slate-200 focus:border-emerald-500" />
          <InputOTPSlot index={3} className="w-14 h-14 sm:w-20 sm:h-20 border-slate-200 focus:border-emerald-500" />
        </InputOTPGroup>
      </InputOTP>
      {/* Verify Button */}
      <Button
        className="mt-8 w-full max-w-sm py-6 text-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={otpValue.length !== 4 || isSubmitting || isLoading}
      >
        {isSubmitting || isLoading ? "Verifying..." : otpValue.length === 4 ? "Verify OTP" : `Enter ${4 - otpValue.length} more digits`}
      </Button>
      {/* Resend Code */}
      <p className="text-base text-gray-600 mt-6">
        Didn&apos;t receive code?{" "}
        <button className="text-emerald-600 hover:underline font-medium disabled:opacity-60"
          onClick={handleResend}
          disabled={resendCooldown > 0 || isLoading}
        >
          {isLoading ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
        </button>
      </p>
      {/* Back button */}
      <button 
        className="mt-8 flex items-center text-base text-gray-700 hover:underline" 
        onClick={() => router.push(isPasswordReset ? "/login/forgot-password" : "/login")}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        {isPasswordReset ? "Back to forgot password" : "Back to log in"}
      </button>
    </div>
  );
}

export default function OTPVerificationPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <div className="mb-6 bg-emerald-100 rounded-full p-5">
          <MailIcon className="text-emerald-600 w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          Loading...
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8 text-center">
          Please wait while we load the verification page.
        </p>
      </div>
    }>
      <OTPVerificationComponent />
    </Suspense>
  );
}
