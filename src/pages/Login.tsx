
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { z } from "zod";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";
// import { GoogleIcon } from "@/components/icons/GoogleIcon";
// import { useAuth } from "@/contexts/AuthContext"; // Import useAuth


// const loginSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
//   password: z.string().min(1, "Password is required"),
// });

// const Login = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { login } = useAuth(); // Get the login function from context
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [loading, setLoading] = useState(false);
  
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     // Clear errors when user types
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     try {
//       loginSchema.parse(formData);
//       return true;
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const newErrors: Record<string, string> = {};
//         error.errors.forEach((err) => {
//           if (err.path[0]) {
//             newErrors[err.path[0].toString()] = err.message;
//           }
//         });
//         setErrors(newErrors);
//       }
//       return false;
//     }
//   };

//    const handleSubmit = async (e: React.FormEvent) => {
//      e.preventDefault();
     
//      if (!validateForm()) return;
     
//      setLoading(true);
     
//      try {
//        // In a real app, replace with your actual API endpoint
//        const response = await fetch('http://localhost:5000/api/login', {
//          method: 'POST',
//          headers: {
//            'Content-Type': 'application/json',
//          },
//          body: JSON.stringify(formData),
//        });
       
//        if (!response.ok) {
//          // It's often better to parse the error response *before* throwing
//          let errorData = { message: 'Login failed' }; 
//          try {
//            errorData = await response.json();
//          } catch (parseError) {
//            console.error("Failed to parse error response:", parseError);
//          }
//          throw new Error(errorData.message || 'Login failed');
//        }
       
//        // Process login response
//        const userData = await response.json();
       
//        // --- Start: Update Auth State and Local Storage ---
       
//        // 1. Save user data to localStorage (for ProtectedRoute and persistence)
//        // Ensure userData is not null/undefined before stringifying
//        if (userData) {
//          localStorage.setItem('user', JSON.stringify(userData));
//        } else {
//          // Handle cases where the API might return unexpected empty data
//          console.warn("Received empty user data from login API");
//          // Optionally throw an error or show a specific toast
//          throw new Error("Login successful, but no user data received.");
//        }
 
//        // 2. Update the AuthContext state
//        // Make sure your login function handles the structure of userData correctly
//        login(userData); 
       
//        // --- End: Update Auth State and Local Storage ---
       
//        toast({
//          title: "Success",
//          description: "Logged in successfully!",
//        });
       
//        // Navigate *after* state updates
//        navigate("/account-settings");
       
//      } catch (error) {
//        console.error("Login error:", error);
//        // Clear potentially stale user data if login fails after a previous success
//        localStorage.removeItem('user'); 
//        toast({
//          title: "Error",
//          description: error instanceof Error ? error.message : "Login failed",
//          variant: "destructive",
//        });
//      } finally {
//        setLoading(false);
//      }
//    };
 
//   const handleGoogleLogin = () => {
//     setLoading(true);
    
//     // Simulate Google login
//     toast({
//       title: "Google Authentication",
//       description: "Connecting to Google...",
//     });
    
//     // Simulate API call delay
//     setTimeout(() => {
//       setLoading(false);
//       toast({
//         title: "Success",
//         description: "Logged in with Google successfully!",
//       });
//       navigate("/account-settings");
//     }, 1500);
//   };

//   return (
//     <div className="flex min-h-screen flex-col bg-stockify-dark text-stockify-text">
//       <header className="p-6">
//         <div className="flex items-center gap-2">
//           <span className="text-xl font-semibold text-white flex items-center">
//             ✧ Stock World
//           </span>
//         </div>
//       </header>
      
//       <main className="flex flex-1 flex-col items-center justify-center p-6">
//         <div className="w-full max-w-md space-y-6">
//           <div className="text-center space-y-2">
//             <h1 className="text-2xl font-semibold tracking-tight">Login to Your Account</h1>
//             <p className="text-sm text-stockify-muted">Please enter your credentials to continue</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`bg-[#222] border ${errors.email ? "border-red-500" : "border-gray-800"}`}
//               />
//               {errors.email && (
//                 <p className="text-xs text-red-500">{errors.email}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`bg-[#222] border ${errors.password ? "border-red-500" : "border-gray-800"}`}
//               />
//               {errors.password && (
//                 <p className="text-xs text-red-500">{errors.password}</p>
//               )}
//             </div>

//             <Button 
//               type="submit" 
//               disabled={loading}
//               className="w-full bg-[#1976d2] hover:bg-[#1565c0] text-white"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </Button>
//           </form>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t border-gray-800" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-stockify-dark px-2 text-stockify-muted">
//                 or continue with
//               </span>
//             </div>
//           </div>

//           <Button 
//             variant="outline" 
//             className="w-full border-gray-800 bg-transparent text-white hover:bg-gray-800 flex gap-2 items-center justify-center"
//             onClick={handleGoogleLogin}
//             disabled={loading}
//           >
//             <GoogleIcon />
//             <span>Google</span>
//           </Button>
          
//           <div className="flex items-center space-x-2 justify-center">
//             <Checkbox id="remember-me" />
//             <label htmlFor="remember-me" className="text-sm text-stockify-muted">Remember Me</label>
//           </div>
          
//           <p className="text-center text-sm text-stockify-muted">
//             Don't have an account?{" "}
//             <Link to="/sign-in" className="text-stockify-accent font-medium hover:underline">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Login;
// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth


const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth(); // Get the login function from context
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();

     if (!validateForm()) return;

     setLoading(true);

     try {
       // In a real app, replace with your actual API endpoint
       const response = await fetch('http://localhost:5000/api/login', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(formData),
       });

       if (!response.ok) {
         // It's often better to parse the error response *before* throwing
         let errorData = { message: 'Login failed' };
         try {
           errorData = await response.json();
         } catch (parseError) {
           console.error("Failed to parse error response:", parseError);
         }
         throw new Error(errorData.message || 'Login failed');
       }

       // Process login response
       const userData = await response.json();

       // --- Start: Update Auth State and Local Storage ---

       // 1. Save user data to localStorage (for ProtectedRoute and persistence)
       // Ensure userData is not null/undefined before stringifying
       if (userData) {
         localStorage.setItem('user', JSON.stringify(userData));
       } else {
         // Handle cases where the API might return unexpected empty data
         console.warn("Received empty user data from login API");
         // Optionally throw an error or show a specific toast
         throw new Error("Login successful, but no user data received.");
       }

       // 2. Update the AuthContext state
       // Make sure your login function handles the structure of userData correctly
       login(userData);

       // --- End: Update Auth State and Local Storage ---

       toast({
         title: "Success",
         description: "Logged in successfully!",
       });

       // --- CHANGE THIS LINE ---
       // Navigate *after* state updates
       // navigate("/account-settings"); // Old line
       navigate("/dashboard"); // New line: Redirect to dashboard
       // --- END CHANGE ---

     } catch (error) {
       console.error("Login error:", error);
       // Clear potentially stale user data if login fails after a previous success
       localStorage.removeItem('user');
       toast({
         title: "Error",
         description: error instanceof Error ? error.message : "Login failed",
         variant: "destructive",
       });
     } finally {
       setLoading(false);
     }
   };

  // Also update the Google login redirect if you want that to go to the dashboard too
  const handleGoogleLogin = () => {
    setLoading(true);

    // Simulate Google login
    toast({
      title: "Google Authentication",
      description: "Connecting to Google...",
    });

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Success",
        description: "Logged in with Google successfully!",
      });
      // --- CHANGE THIS LINE ---
      // navigate("/account-settings"); // Old line
      navigate("/dashboard"); // New line: Redirect to dashboard
      // --- END CHANGE ---
    }, 1500);
  };

  // ... rest of the component remains the same
  return (
    <div className="flex min-h-screen flex-col bg-stockify-dark text-stockify-text">
      <header className="p-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-white flex items-center">
            ✧ Stock World
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Login to Your Account</h1>
            <p className="text-sm text-stockify-muted">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input fields remain the same */}
             <div className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`bg-[#222] border ${errors.email ? "border-red-500" : "border-gray-800"}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`bg-[#222] border ${errors.password ? "border-red-500" : "border-gray-800"}`}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1976d2] hover:bg-[#1565c0] text-white"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-stockify-dark px-2 text-stockify-muted">
                or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-gray-800 bg-transparent text-white hover:bg-gray-800 flex gap-2 items-center justify-center"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <GoogleIcon />
            <span>Google</span>
          </Button>

          <div className="flex items-center space-x-2 justify-center">
            <Checkbox id="remember-me" />
            <label htmlFor="remember-me" className="text-sm text-stockify-muted">Remember Me</label>
          </div>

          <p className="text-center text-sm text-stockify-muted">
            Don't have an account?{" "}
            <Link to="/sign-in" className="text-stockify-accent font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
