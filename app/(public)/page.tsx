"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import TabContent from "@/components/TabContent";

export default function Page() {
  const [activeTab, setActiveTab] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      window.location.href = "/login";
    }
  }, [isAuthenticated]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your memory vault...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <TabContent activeTab={activeTab} />
          {/* Mobile Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
            <div className="flex items-center justify-around p-2">
              {[
                { id: "home", icon: "🏠", label: "Home" },
                { id: "record", icon: "🎤", label: "Record" },
                { id: "timeline", icon: "📅", label: "Timeline" },
                { id: "settings", icon: "⚙️", label: "Settings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center p-2 rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-xs mt-1">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex">
          {/* Sidebar */}
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <TabContent activeTab={activeTab} />
          </div>
        </div>
      </div>
    );
  }

  // This shouldn't render, but just in case
  return null;
}
