
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./Navbar";
import { Outlet, Navigate } from "react-router-dom";

interface LayoutProps {
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ requireAuth = false }) => {
  const { user, isLoading } = useAuth();

  // If authentication is required and user is not logged in, redirect to login
  if (requireAuth && !user && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  // If user is already logged in and trying to access login/register, redirect to home
  if (user && !requireAuth && (window.location.pathname === "/login" || window.location.pathname === "/register")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <Outlet />
      </main>
      <footer className="py-6 bg-mitwpu-navy text-white text-center">
        <div className="container mx-auto">
          <p className="text-sm">© {new Date().getFullYear()} MIT-WPU Find It Now. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
