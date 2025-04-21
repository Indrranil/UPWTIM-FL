import React, { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";
import EmailVerification from "@/components/auth/EmailVerification";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { authApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

const Register: React.FC = () => {
  const [step, setStep] = useState<"userInfo" | "verification" | "complete">(
    "userInfo",
  );
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const { toast } = useToast();

  const handleUserInfoSubmit = (data: typeof userData) => {
    setUserData(data);
    setStep("verification");
  };

  const handleVerificationSuccess = async (verifiedEmail: string) => {
    try {
      const registeredUser = await authApi.register({
        ...userData,
        email: verifiedEmail,
      });

      toast({
        title: "Registration successful",
        description: `Welcome, ${registeredUser.name}`,
      });

      setStep("complete");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description:
          error.response?.data?.message ||
          "Something went wrong during registration.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setStep("userInfo");
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Register to start finding or listing lost items
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "userInfo" && (
            <AuthForm type="register" onUserInfoSubmit={handleUserInfoSubmit} />
          )}

          {step === "verification" && (
            <div>
              <div className="mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="mb-4"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
                <p className="text-sm text-gray-600 mb-4">
                  Please verify your email address{" "}
                  <strong>{userData.email}</strong> to continue.
                </p>
              </div>
              <EmailVerification
                initialEmail={userData.email}
                onVerified={() => handleVerificationSuccess(userData.email)}
              />
            </div>
          )}

          {step === "complete" && (
            <div className="text-center text-green-600 font-medium py-4">
              🎉 Account created successfully! You can now log in.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
