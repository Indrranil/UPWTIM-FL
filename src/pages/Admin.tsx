import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReportManagement } from "@/components/admin/ReportManagement";
import { ItemModeration } from "@/components/admin/ItemModeration";
import { ClaimDisputes } from "@/components/admin/ClaimDisputes";
import { UserManagement } from "@/components/admin/UserManagement";
import { Loader2, AlertTriangle, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AnalyticsChart from "@/components/admin/AnalyticsChart";

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Verify admin access on component mount
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive",
      });
    }
  }, []);

  // Check if user is admin
  if (!user || user.role !== "ROLE_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6 text-center">
          You don't have permission to access the admin panel. This area is
          restricted to administrators only.
        </p>
        <Button asChild variant="default">
          <Navigate to="/" replace />
        </Button>
      </div>
    );
  }

  // Fetch analytics data
  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: adminApi.getAnalytics,
    refetchOnWindowFocus: false,
  });

  if (isLoadingAnalytics && activeTab === "dashboard") {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (analyticsError && activeTab === "dashboard") {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load analytics data. Please try again later.
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => refetchAnalytics()}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
      </div>

      <Tabs defaultValue="dashboard" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full md:w-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.items?.total || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics?.items?.lost || 0} lost,{" "}
                  {analytics?.items?.found || 0} found
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Claims
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.claims?.total || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics?.claims?.pending || 0} pending
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.reports?.total || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics?.reports?.pending || 0} pending
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Registered Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.users || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AnalyticsChart
              title="Item Statistics"
              data={[
                { name: "Lost", value: analytics?.items?.lost || 0 },
                { name: "Found", value: analytics?.items?.found || 0 },
              ]}
              colors={["#f97316", "#3b82f6"]}
            />
            <AnalyticsChart
              title="Claim Statistics"
              data={[
                { name: "Pending", value: analytics?.claims?.pending || 0 },
                { name: "Approved", value: analytics?.claims?.approved || 0 },
                { name: "Rejected", value: analytics?.claims?.rejected || 0 },
              ]}
              colors={["#f97316", "#10b981", "#ef4444"]}
            />
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <ItemModeration />
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <ClaimDisputes />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportManagement />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
