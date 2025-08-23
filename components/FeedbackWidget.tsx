"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, X, Star, Send, Bug, Lightbulb, Heart } from 'lucide-react';
import { useToast } from './Toast';

type FeedbackType = 'bug' | 'feature' | 'general' | 'love';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const feedbackTypes = [
    { id: 'bug' as const, label: 'Bug Report', icon: Bug, color: 'bg-red-100 text-red-800' },
    { id: 'feature' as const, label: 'Feature Request', icon: Lightbulb, color: 'bg-blue-100 text-blue-800' },
    { id: 'love' as const, label: 'I Love It!', icon: Heart, color: 'bg-green-100 text-green-800' },
    { id: 'general' as const, label: 'General Feedback', icon: MessageSquare, color: 'bg-gray-100 text-gray-800' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      error('Missing message', 'Please provide your feedback message.');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you'd send this to your feedback API
      const feedbackData = {
        type,
        message: message.trim(),
        rating: type === 'love' ? rating : undefined,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Feedback submitted:', feedbackData);
      
      // You could send this to:
      // - Your own API endpoint
      // - A service like Typeform, Airtable, or Google Forms
      // - Email via a service like EmailJS
      // - A feedback tool like Canny or Feature OS
      
      success('Feedback sent!', 'Thank you for helping us improve LifeMoments.');
      
      // Reset form
      setMessage('');
      setRating(0);
      setType('general');
      setIsOpen(false);
      
    } catch (err) {
      error('Failed to send feedback', 'Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = feedbackTypes.find(t => t.id === type)!;

  return (
    <>
      {/* Feedback Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">Share Your Feedback</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Feedback Type Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">What kind of feedback?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {feedbackTypes.map(feedbackType => {
                      const Icon = feedbackType.icon;
                      return (
                        <button
                          key={feedbackType.id}
                          type="button"
                          onClick={() => setType(feedbackType.id)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            type === feedbackType.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{feedbackType.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating for "love" feedback */}
                {type === 'love' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">How much do you love it?</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-1 transition-colors ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {type === 'bug' ? 'Describe the bug you encountered:' :
                     type === 'feature' ? 'What feature would you like to see?' :
                     type === 'love' ? 'What do you love most?' :
                     'Your feedback:'}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      type === 'bug' ? 'Please describe what happened and what you expected...' :
                      type === 'feature' ? 'I would love to see...' :
                      type === 'love' ? 'What makes LifeMoments special for you...' :
                      'Tell us what you think...'
                    }
                    className="w-full h-24 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
