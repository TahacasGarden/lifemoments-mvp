"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Mic,
  Video,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  Play,
  MessageCircle,
  Calendar,
  Shield,
  BookOpen,
  Gift,
  Star,
  Zap,
  Target,
  Lightbulb,
  Camera,
  FileText,
  Share2,
  Settings
} from "lucide-react";
import AudioCapture from "./audio-capture";
import MemoryTimeline from "./MemoryTimeline";

interface TabContentProps {
  activeTab: string;
}

export default function TabContent({ activeTab }: TabContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-8">
            {/* Welcome Hero */}
            <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-2xl p-8 border border-primary/20">
              <div className="text-center max-w-3xl mx-auto">
                <Badge className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
                  ✨ Welcome to Your Memory Vault
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
                  Ready to Preserve Your Legacy?
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Your stories matter. Your wisdom has value. Let's capture what makes you uniquely you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    <Play className="mr-2 h-4 w-4" />
                    Start Your First Story
                  </Button>
                  <Button variant="outline">
                    <Video className="mr-2 h-4 w-4" />
                    Take a Tour
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Start Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Mic className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Record a Memory</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share a cherished memory, life lesson, or piece of advice in just a few minutes.
                  </p>
                  <Button size="sm" className="w-full">
                    <Mic className="mr-2 h-3 w-3" />
                    Start Recording
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-2">
                    <BookOpen className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">Story Prompts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Need inspiration? Browse curated prompts designed to unlock your most meaningful stories.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Lightbulb className="mr-2 h-3 w-3" />
                    Get Inspired
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Invite Family</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a shared family memory vault where everyone can contribute their stories.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Heart className="mr-2 h-3 w-3" />
                    Share Access
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Your Journey So Far
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mic className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Welcome to LifeMoments</p>
                        <p className="text-xs text-muted-foreground">Ready to begin your journey</p>
                      </div>
                    </div>
                    <Badge variant="secondary">New</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "record":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Record Your Stories</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Capture your memories, wisdom, and experiences. Every story you share becomes a treasured part of your legacy.
              </p>
            </div>

            {/* Working Audio Recording */}
            <AudioCapture
              defaultTitle="My Memory"
              defaultVisibility="private"
              onCreated={() => {
                // Optional: Add success feedback
                console.log("Audio saved successfully!");
              }}
            />

            {/* Video Recording - Coming Soon */}
            <Card className="border-secondary/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-2">
                  <Video className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Video Recording</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Record video messages and stories. Capture facial expressions and gestures that make your stories come alive.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  <Video className="mr-2 h-4 w-4" />
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* Story Categories */}
            <Card>
              <CardHeader>
                <CardTitle>What Would You Like to Share?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Heart, label: "Life Lessons", color: "text-red-500" },
                    { icon: Star, label: "Achievements", color: "text-yellow-500" },
                    { icon: Users, label: "Family Stories", color: "text-blue-500" },
                    { icon: Gift, label: "Traditions", color: "text-green-500" },
                    { icon: Lightbulb, label: "Advice", color: "text-purple-500" },
                    { icon: Camera, label: "Adventures", color: "text-orange-500" },
                    { icon: BookOpen, label: "Childhood", color: "text-pink-500" },
                    { icon: Sparkles, label: "Dreams", color: "text-cyan-500" },
                  ].map((category, index) => (
                    <Button key={index} variant="outline" className="h-20 flex-col space-y-2">
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                      <span className="text-xs">{category.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "timeline":
        return <MemoryTimeline />;

      case "legacy":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Legacy Builder</h1>
              <p className="text-lg text-muted-foreground">
                Create beautiful legacy packages to share with family and future generations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Memory Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Create a beautiful digital or physical book with your stories, photos, and memories.
                  </p>
                  <Button variant="outline" className="w-full">Coming Soon</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-2">
                    <Gift className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>Time Capsule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Create digital time capsules to be opened by family members at specific dates.
                  </p>
                  <Button variant="outline" className="w-full">Coming Soon</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "share":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Share & Connect</h1>
              <p className="text-lg text-muted-foreground">
                Connect with family members and share your precious memories.
              </p>
            </div>

            <Card>
              <CardContent className="p-8 text-center">
                <Share2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Connect Your Family</h3>
                <p className="text-muted-foreground mb-6">
                  Invite family members to view and contribute to your shared memory collection.
                </p>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Family Members
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "stories":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Story Ideas & Prompts</h1>
              <p className="text-lg text-muted-foreground">
                Discover prompts and ideas to help you share your most meaningful stories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { category: "Childhood", prompts: ["Your earliest memory", "Favorite family tradition", "A lesson from grandparents"] },
                { category: "Life Lessons", prompts: ["Biggest life challenge", "Most important advice", "A moment that changed you"] },
                { category: "Family", prompts: ["How you met your partner", "Proudest parenting moment", "Family recipe story"] },
                { category: "Career", prompts: ["First job experience", "Career highlight", "Work-life wisdom"] },
                { category: "Adventures", prompts: ["Best travel memory", "Unexpected journey", "Adventure gone wrong"] },
                { category: "Values", prompts: ["What matters most", "Core beliefs", "Hope for future generations"] },
              ].map((section, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{section.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.prompts.map((prompt, promptIndex) => (
                        <Button key={promptIndex} variant="ghost" size="sm" className="w-full justify-start text-left h-auto p-2">
                          <div className="text-sm">{prompt}</div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "family":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Family Tree</h1>
              <p className="text-lg text-muted-foreground">
                Connect generations and build a comprehensive family memory network.
              </p>
            </div>

            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Build Your Family Network</h3>
                <p className="text-muted-foreground mb-6">
                  Create connections between family members and their stories across generations.
                </p>
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Start Building Family Tree
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Settings</h1>
              <p className="text-lg text-muted-foreground">
                Customize your LifeMoments experience and privacy preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Default privacy level</span>
                      <Badge variant="outline">Family Only</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-backup</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recording Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audio quality</span>
                      <Badge variant="outline">High</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-transcription</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
}
