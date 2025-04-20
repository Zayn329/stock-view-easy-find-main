// // src/App.tsx
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import SignIn from "./pages/SignIn";
// import Login from "./pages/Login";
// import AccountSettings from "./pages/AccountSettings";
// import Dashboard from "./pages/Dashboard"; // <-- Import Dashboard

// // Protected route component
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const user = localStorage.getItem('user');

//   if (!user) {
//     // Redirect them to the /login page, but save the current location they were
//     // trying to go to. This allows us to send them along to that page after they login,
//     // which is a nicer user experience than dropping them off on the home page.
//     // You might need to adjust your Login component to handle this state.
//     // For simplicity now, just redirecting to login.
//     return <Navigate to="/login" replace />; // Added replace prop
//   }

//   return <>{children}</>;
// };

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <AuthProvider>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Index />} />
//             <Route path="/sign-in" element={<SignIn />} />
//             <Route path="/login" element={<Login />} />

//             {/* Protected Routes */}
//             <Route
//               path="/dashboard" // <-- Add the dashboard route
//               element={
//                 <ProtectedRoute>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/account-settings"
//               element={
//                 <ProtectedRoute>
//                   <AccountSettings />
//                 </ProtectedRoute>
//               }
//             />
//             {/* Remove the duplicate /user route if /account-settings is the correct one */}
//             {/* <Route path="/user" element={<AccountSettings />} />s */} {/* <-- Remove this line if not needed */}


//             {/* Catch-all Not Found Route */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </AuthProvider>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;
// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import Login from "./pages/Login";
import AccountSettings from "./pages/AccountSettings";
import Dashboard from "./pages/Dashboard";
// --- CHANGE: Import the wrapper component ---
import StockDetailWrapper from "./pages/StockDetailWrapper"; // Or StockDetailPage if you named it that

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* --- CHANGE: Use the wrapper component for the route --- */}
            <Route
              path="/stock/:ticker" // Route pattern remains the same
              element={
                <ProtectedRoute> {/* Keep protected if needed */}
                  {/* Render the wrapper component */}
                  <StockDetailWrapper />
                </ProtectedRoute>
              }
            />
            {/* --- END CHANGE --- */}
            <Route
              path="/account-settings"
              element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
