import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const emailSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .refine((email) => email.endsWith("@mitwpu.edu.in"), {
      message: "Only MIT-WPU email addresses are allowed",
    }),
});

const otpSchema = z.object({
  otp: z.string().min(6, "Please enter a valid 6-digit OTP"),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

interface EmailVerificationProps {
  onVerified: (email: string) => void;
  initialEmail?: string;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  onVerified,
  initialEmail = "",
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: initialEmail,
    },
  });

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleSendOtp = async (values: EmailFormValues) => {
    setIsLoading(true);
    try {
      await authApi.sendOtp(values.email);
      setEmail(values.email);
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${values.email}`,
      });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (values: OTPFormValues) => {
    setIsLoading(true);
    try {
      const isValid = await authApi.verifyOtp(email, values.otp);
      if (isValid) {
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified.",
        });
        onVerified(email);
      } else {
        toast({
          title: "Invalid OTP",
          description:
            "The verification code you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!otpSent ? (
        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(handleSendOtp)}
            className="space-y-4"
          >
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your MIT-WPU email"
                      disabled={isLoading || !!initialEmail}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-mitwpu-navy hover:bg-mitwpu-navy/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
            className="space-y-4"
          >
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Enter the 6-digit verification code sent to{" "}
                <strong>{email}</strong>
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-xs mt-1"
                onClick={() => {
                  setOtpSent(false);
                  setEmail("");
                }}
                type="button"
              >
                Change email
              </Button>
            </div>

            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full bg-mitwpu-navy hover:bg-mitwpu-navy/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => handleSendOtp({ email })}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend OTP"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EmailVerification;
