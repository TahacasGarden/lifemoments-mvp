import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Mic, Video, Clock, Users, Sparkles, ArrowRight, Play, MessageCircle, Calendar, Shield } from "lucide-react";
import Header from "@/components/Header";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto text-center max-w-5xl">
          <Badge className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
            💡 The Memory Bank for the Future
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent leading-tight">
            Capture Life&apos;s Wisdom.
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Leave a Legacy.
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Don&apos;t let your most precious memories, advice, and life lessons disappear.
            LifeMoments turns your voice into a living legacy that future generations will treasure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <Play className="mr-2 h-5 w-5" />
              Start Recording Your Legacy
            </Button>
            <Button variant="outline" className="text-lg px-8 py-6">
              <Video className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto max-w-4xl">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-primary/20 bg-background/50 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <Mic className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Record</h3>
                    <p className="text-sm text-muted-foreground">Share your stories, advice, and wisdom</p>
                  </CardContent>
                </Card>
                <Card className="border-secondary/20 bg-background/50 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <Sparkles className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Organize</h3>
                    <p className="text-sm text-muted-foreground">AI creates your personal timeline</p>
                  </CardContent>
                </Card>
                <Card className="border-accent/20 bg-background/50 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Share</h3>
                    <p className="text-sm text-muted-foreground">Leave a legacy for loved ones</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Do We Forget What Matters Most?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Every day, precious memories fade. Life lessons go unshared.
            Wisdom dies with its keeper. But what if it didn&apos;t have to?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">Memory Fades</h3>
              <p className="text-sm text-muted-foreground">Important stories and lessons slip away over time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">Wisdom Unshared</h3>
              <p className="text-sm text-muted-foreground">Life&apos;s greatest lessons never reach the next generation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">Regret Grows</h3>
              <p className="text-sm text-muted-foreground">&quot;I wish I had asked...&quot; becomes too common</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Life. Your Voice. Your Legacy.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              LifeMoments makes it simple to capture and preserve what matters most,
              automatically organizing your memories into a beautiful timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* replicate your six cards here exactly like the hero grid */}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-2xl p-8 md:p-12 border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Building Your Legacy Today</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don&apos;t wait until it&apos;s too late. Your stories matter. Your wisdom has value.
              Your voice deserves to be heard by future generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                Begin Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="text-lg px-8 py-6">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-primary fill-primary/20" />
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LifeMoments
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Preserving what matters most, one moment at a time.</p>
        </div>
      </footer>
    </div>
  );
}
