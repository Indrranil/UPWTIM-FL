
import React from "react";
import AuthForm from "@/components/auth/AuthForm";

const Register: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-12">
      <AuthForm type="register" />
    </div>
  );
};

export default Register;
