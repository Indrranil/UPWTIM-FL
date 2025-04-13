
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Search, 
  Plus,
  LayoutDashboard
} from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-mitwpu-navy text-white shadow-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            MIT-WPU Find It Now
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 items-center">
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/create" className="hover:text-gray-300">
                  Report Item
                </Link>
                <Link to="/dashboard" className="hover:text-gray-300">
                  Dashboard
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-gray-300">
                      <User className="mr-2 h-4 w-4" />
                      {user.name.split(" ")[0]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="w-full cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/create" className="w-full cursor-pointer">
                        <Plus className="mr-2 h-4 w-4" />
                        Report Item
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="text-red-500 focus:text-red-500 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 border border-white rounded hover:bg-white hover:text-mitwpu-navy transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-white text-mitwpu-navy rounded hover:bg-opacity-90 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-mitwpu-navy px-4 py-4 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="hover:text-gray-300" onClick={toggleMenu}>
              Home
            </Link>
            {user ? (
              <>
                <Link to="/create" className="hover:text-gray-300" onClick={toggleMenu}>
                  Report Item
                </Link>
                <Link to="/dashboard" className="hover:text-gray-300" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <div className="py-2 border-t border-gray-700">
                  <p className="text-sm text-gray-300 mb-2">{user.email}</p>
                  <button 
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="flex items-center text-red-400 hover:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 border border-white rounded text-center hover:bg-white hover:text-mitwpu-navy transition-colors"
                  onClick={toggleMenu}
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-white text-mitwpu-navy rounded text-center hover:bg-opacity-90 transition-colors"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
