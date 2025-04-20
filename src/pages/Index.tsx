// c:\Users\zainp\Desktop\stock-view-easy-find-main - Copy\stock-view-easy-find-main\src\pages\Index.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar"; // Adjusted import path
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth to potentially customize the "User" link

const Index = () => {
  const { user } = useAuth(); // Get user info

  return (
    <div className="min-h-screen bg-stockify-dark text-stockify-text">
      <header className="p-6">
        <Navbar />

        {/* Removed the extra div below Navbar */}
        {/* The "User" link is now handled within the Navbar (Login button or Avatar) */}

      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8 pt-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to Stockify {/* Changed from Stock World */}
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Your gateway to the stock market. Search stocks, track performance, and make informed decisions.
          </p>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            {/* Link to Dashboard if logged in, otherwise Sign In/Get Started */}
            {user ? (
               <Link to="/dashboard">
                 <Button className="px-8 py-6 text-lg bg-[#1976d2] hover:bg-[#1565c0] text-white">
                   Go to Dashboard
                 </Button>
               </Link>
            ) : (
               <Link to="/login"> {/* Changed from sign-in to login */}
                 <Button className="px-8 py-6 text-lg bg-[#1976d2] hover:bg-[#1565c0] text-white">
                   Get Started / Login
                 </Button>
               </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
