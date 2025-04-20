
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

const signInSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must include at least one special character")
    .regex(/[0-9]/, "Password must include at least one number")
});

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
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
      signInSchema.parse(formData);
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
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      navigate("/");
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    
    // Simulate Google sign in
    toast({
      title: "Google Authentication",
      description: "Connecting to Google...",
    });
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Success",
        description: "Signed in with Google successfully!",
      });
      navigate("/");
    }, 1500);
  };

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
            <h1 className="text-2xl font-semibold tracking-tight">Sign in to Your Account</h1>
            <p className="text-sm text-stockify-muted">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={`bg-[#222] border ${errors.username ? "border-red-500" : "border-gray-800"}`}
              />
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username}</p>
              )}
            </div>
            
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
              {loading ? "Signing in..." : "Sign In"}
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
            onClick={handleGoogleSignIn}
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
            Already have an account?{" "}
            <Link to="/login" className="text-stockify-accent font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
