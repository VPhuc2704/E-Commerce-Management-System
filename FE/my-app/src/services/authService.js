// Base API URL - replace with your actual API URL
   const API_URL = "https://api.example.com/auth";

   // Helper to handle API responses
   const handleResponse = async (response) => {
     const data = await response.json();
     
     if (!response.ok) {
       const error = (data && data.message) || response.statusText;
       return Promise.reject(error);
     }
     
     return data;
   };

   // Login service
   export const login = async (email, password) => {
     const response = await fetch(`${API_URL}/login`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ email, password })
     });
     
     const data = await handleResponse(response);
     
     // If login was successful, store the token in localStorage
     if (data.token) {
       localStorage.setItem("user", JSON.stringify(data));
     }
     
     return data;
   };

   // Register service
   export const register = async (userData) => {
     const response = await fetch(`${API_URL}/register`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(userData)
     });
     
     return handleResponse(response);
   };

   // Logout service
   export const logout = () => {
     localStorage.removeItem("user");
   };

   // Get current authenticated user
   export const getCurrentUser = () => {
     const userStr = localStorage.getItem("user");
     if (!userStr) {
       // Mock a user for development (bypass login)
       const mockUser = {
         token: "dev123",
         name: "Dev User",
         email: "dev@example.com",
         isAdmin: true // Set to true for admin access, false for regular user
       };
       localStorage.setItem("user", JSON.stringify(mockUser));
       return mockUser;
     }
     
     return JSON.parse(userStr);
   };

   // Check if user is authenticated
   export const isAuthenticated = () => {
     const user = getCurrentUser();
     return !!user?.token;
   };

   export default {
     login,
     register,
     logout,
     getCurrentUser,
     isAuthenticated
   };