import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Login } from "./pages/Login";
import { JobSeekerDashboard } from "./pages/JobSeekerDashboard";
import { HRDashboard } from "./pages/HRDashboard";

function MainContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  // Strict Role-Based View Isolation
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === "hr" ? (
          <HRDashboard />
        ) : (
          <JobSeekerDashboard />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
