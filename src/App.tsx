
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ItemsProvider } from "@/contexts/ItemsContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Items from "@/pages/Items";
import ItemDetail from "@/pages/ItemDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import CreateItem from "@/pages/CreateItem";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ItemsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="items" element={<Items />} />
                <Route path="items/:id" element={<ItemDetail />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
              
              {/* Protected Routes */}
              <Route path="/" element={<Layout requireAuth />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="create" element={<CreateItem />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ItemsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
