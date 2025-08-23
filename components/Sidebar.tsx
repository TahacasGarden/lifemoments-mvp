"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Mic,
  Calendar,
  Users,
  Settings,
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  BookOpen,
  Share2,
  Trophy,
  LogOut
} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainTabs = [
    { id: "home", label: "Welcome", icon: Home, description: "Getting started" },
    { id: "record", label: "Record Stories", icon: Mic, description: "Capture memories" },
    { id: "timeline", label: "My Timeline", icon: Calendar, description: "View your journey" },
    { id: "legacy", label: "Legacy Builder", icon: Trophy, description: "Create your legacy" },
    { id: "share", label: "Share & Connect", icon: Share2, description: "Connect with family" },
  ];

  const secondaryTabs = [
    { id: "stories", label: "Story Ideas", icon: BookOpen, description: "Get inspired" },
    { id: "family", label: "Family Tree", icon: Users, description: "Connect generations" },
    { id: "settings", label: "Settings", icon: Settings, description: "Customize experience" },
  ];

  return (
    <div className={`h-screen bg-card border-r border-border transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'} flex flex-col`}>
      {/* Toggle Button */}
      <div className="p-4 border-b border-border flex justify-between items-center">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary fill-primary/20" />
            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LifeMoments
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Welcome Message */}
      {!isCollapsed && (
        <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
          <Card className="border-primary/20 bg-background/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Welcome back!</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Continue building your legacy and preserving precious memories.
              </p>
              <Button size="sm" className="w-full bg-gradient-to-r from-primary to-secondary text-xs">
                <Play className="h-3 w-3 mr-1" />
                Quick Record
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {!isCollapsed && (
            <div className="px-2 py-1 mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Main Features
              </span>
            </div>
          )}
          <nav className="space-y-1">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : ''}`} />
                  {!isCollapsed && (
                    <div className="text-left">
                      <div className={`text-sm font-medium ${isActive ? 'text-primary-foreground' : ''}`}>
                        {tab.label}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {tab.description}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div className="p-2 border-t border-border mt-4">
          {!isCollapsed && (
            <div className="px-2 py-1 mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Explore More
              </span>
            </div>
          )}
          <nav className="space-y-1">
            {secondaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : ''}`} />
                  {!isCollapsed && (
                    <div className="text-left">
                      <div className={`text-sm font-medium ${isActive ? 'text-primary-foreground' : ''}`}>
                        {tab.label}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {tab.description}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <Heart className="h-3 w-3 mr-2" />
              Invite Family
            </Button>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <Badge variant="secondary" className="text-xs">3 stories</Badge>
            </div>
            <div className="w-full bg-secondary/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-1/3"></div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile & Logout */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Your Account</p>
              <p className="text-xs text-muted-foreground truncate">Memory Creator</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs text-muted-foreground hover:text-foreground"
            onClick={async () => {
              const { supabase } = await import("@/lib/supabase");
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
          >
            <LogOut className="h-3 w-3 mr-2" />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
}
