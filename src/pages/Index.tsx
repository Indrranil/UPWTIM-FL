
import React from "react";
import { Link } from "react-router-dom";
import { useItems } from "@/contexts/ItemsContext";
import { useAuth } from "@/contexts/AuthContext";
import ItemGrid from "@/components/items/ItemGrid";
import { Button } from "@/components/ui/button";
import { SearchIcon, PlusIcon } from "lucide-react";

const Index: React.FC = () => {
  const { items } = useItems();
  const { user } = useAuth();
  
  // Take only the most recent 8 items
  const recentItems = [...items].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 8);
  
  return (
    <div className="space-y-12">
      <section className="relative text-center py-16 md:py-24 rounded-lg overflow-hidden bg-gradient-to-r from-mitwpu-navy to-blue-800">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        <div className="relative container px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            MIT-WPU Find It Now
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            The official lost and found portal for MIT World Peace University. Find what you lost or help others find their belongings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-mitwpu-navy hover:bg-white/90"
              asChild
            >
              <Link to="/items">
                <SearchIcon className="mr-2 h-5 w-5" />
                Browse Items
              </Link>
            </Button>
            {user ? (
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/create">
                  <PlusIcon className="mr-2 h-5 w-5" />
                  Report Item
                </Link>
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/login">
                  Login to Report
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      
      <section className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recent Items</h2>
          <Link 
            to="/items" 
            className="text-mitwpu-navy hover:text-mitwpu-navy/70 hover:underline"
          >
            View All
          </Link>
        </div>
        
        {recentItems.length > 0 ? (
          <ItemGrid items={recentItems} />
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <h3 className="text-xl font-medium mb-2">No Items Yet</h3>
            <p className="text-gray-500 mb-4">
              Be the first to report a lost or found item!
            </p>
            {user ? (
              <Button asChild>
                <Link to="/create">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Report Item
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/login">
                  Login to Report
                </Link>
              </Button>
            )}
          </div>
        )}
      </section>
      
      <section className="bg-gray-50 py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-mitwpu-navy/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <span className="text-xl font-bold text-mitwpu-navy">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Report</h3>
              <p className="text-gray-600">
                Lost something? Found something? Create a detailed report with pictures to help identify the item.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-mitwpu-navy/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <span className="text-xl font-bold text-mitwpu-navy">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Browse through listings or submit a claim for a found item that matches what you've lost.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-mitwpu-navy/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <span className="text-xl font-bold text-mitwpu-navy">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Recover</h3>
              <p className="text-gray-600">
                Once a match is verified, arrange to collect your lost item securely through the system.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
