"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TabContent from "@/components/TabContent";

export default function Page() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <TabContent activeTab={activeTab} />
      </div>
    </div>
  );
}
