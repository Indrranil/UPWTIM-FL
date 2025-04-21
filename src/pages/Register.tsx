import React, { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EmailVerification from "@/components/auth/EmailVerification";

const Register: React.FC = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [email, setEmail] = useState("");

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
          {!emailVerified ? (
            <EmailVerification
              onVerified={(verifiedEmail) => {
                setEmailVerified(true);
                setEmail(verifiedEmail);
              }}
            />
          ) : (
            <AuthForm type="register" verifiedEmail={email} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
