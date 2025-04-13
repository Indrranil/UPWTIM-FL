
import React from "react";
import AuthForm from "@/components/auth/AuthForm";

const Login: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-12">
      <AuthForm type="login" />
    </div>
  );
};

export default Login;
