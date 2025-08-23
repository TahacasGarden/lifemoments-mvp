"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Mic, 
  Video, 
  FileText, 
  Eye,
  Heart,
  Play,
  Pause,
  Download,
  Share2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Memory {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  event_date: string | null;
  visibility: 'private' | 'family' | 'public';
  media_type: 'audio' | 'video' | 'image' | 'file' | null;
  duration_seconds: number | null;
  storage_path?: string;
}

export default function MemoryTimeline() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        setError("Please sign in to view your memories");
        return;
      }

      const { data: memoriesData, error: memoriesError } = await supabase
        .from('entries')
        .select(`
          id,
          title,
          content,
          created_at,
          event_date,
          visibility,
          entry_media (
            kind,
            duration_seconds,
            storage_path
          )
        `)
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (memoriesError) throw memoriesError;

      const formattedMemories = memoriesData?.map(memory => ({
        id: memory.id,
        title: memory.title || 'Untitled Memory',
        content: memory.content,
        created_at: memory.created_at,
        event_date: memory.event_date,
        visibility: memory.visibility,
        media_type: memory.entry_media?.[0]?.kind || null,
        duration_seconds: memory.entry_media?.[0]?.duration_seconds || null,
        storage_path: memory.entry_media?.[0]?.storage_path || null,
      })) || [];

      setMemories(formattedMemories);
    } catch (err: any) {
      console.error('Error loading memories:', err);
      setError(err.message || 'Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'private': return 'bg-gray-100 text-gray-800';
      case 'family': return 'bg-blue-100 text-blue-800';
      case 'public': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMediaIcon = (mediaType: string | null) => {
    switch (mediaType) {
      case 'audio': return <Mic className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const playAudio = async (memory: Memory) => {
    if (!memory.storage_path) return;

    if (playingAudio === memory.id) {
      setPlayingAudio(null);
      return;
    }

    try {
      const { data } = await supabase.storage
        .from('media')
        .createSignedUrl(memory.storage_path, 60);

      if (data?.signedUrl) {
        const audio = new Audio(data.signedUrl);
        audio.play();
        setPlayingAudio(memory.id);
        
        audio.onended = () => setPlayingAudio(null);
        audio.onerror = () => setPlayingAudio(null);
      }
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your memories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Unable to Load Memories</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadMemories}>Try Again</Button>
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Memories Yet</h3>
        <p className="text-muted-foreground mb-4">
          Start capturing your precious moments and they'll appear here in your personal timeline.
        </p>
        <Button className="bg-gradient-to-r from-primary to-secondary">
          <Mic className="mr-2 h-4 w-4" />
          Record Your First Memory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Memory Timeline</h2>
          <p className="text-muted-foreground">
            {memories.length} precious {memories.length === 1 ? 'memory' : 'memories'} captured
          </p>
        </div>
        <Button variant="outline" onClick={loadMemories}>
          <Calendar className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {memories.map((memory) => (
          <Card key={memory.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    {getMediaIcon(memory.media_type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{memory.title}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(memory.created_at)}</span>
                      {memory.event_date && (
                        <>
                          <span>•</span>
                          <span>Event: {new Date(memory.event_date).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Badge className={getVisibilityColor(memory.visibility)}>
                  {memory.visibility}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              {memory.content && (
                <p className="text-muted-foreground mb-4">{memory.content}</p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {memory.media_type === 'audio' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => playAudio(memory)}
                        className="flex items-center space-x-1"
                      >
                        {playingAudio === memory.id ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                        <span>{playingAudio === memory.id ? 'Pause' : 'Play'}</span>
                      </Button>
                      {memory.duration_seconds && (
                        <span className="text-sm text-muted-foreground">
                          {formatDuration(memory.duration_seconds)}
                        </span>
                      )}
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
