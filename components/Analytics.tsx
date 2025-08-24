"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Simple analytics tracking
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined') {
      // You can replace this with your preferred analytics service
      // Examples: Google Analytics, Plausible, Mixpanel, etc.
      
      console.log('Page view:', pathname);
      
      // Example for Google Analytics (if you add it)
      // gtag('config', 'GA_MEASUREMENT_ID', {
      //   page_path: pathname,
      // });
      
      // Example for Plausible (if you add it)
      // plausible('pageview');
    }
  }, [pathname]);

  return null;
}

// Hook for tracking events
export function useAnalytics() {
  const track = (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      console.log('Event:', event, properties);
      
      // Example implementations:
      
      // Google Analytics
      // gtag('event', event, properties);
      
      // Plausible
      // plausible(event, { props: properties });
      
      // Mixpanel
      // mixpanel.track(event, properties);
      
      // Custom analytics endpoint
      // fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ event, properties })
      // });
    }
  };

  return { track };
}

// Built-in event trackers
export function trackUserRegistration(method: 'email' | 'google') {
  const { track } = useAnalytics();
  track('user_registered', { method });
}

export function trackMemoryCreated(type: 'audio' | 'text' | 'video') {
  const { track } = useAnalytics();
  track('memory_created', { type });
}

export function trackMemoryViewed(memoryId: string, type: 'audio' | 'text' | 'video') {
  const { track } = useAnalytics();
  track('memory_viewed', { memory_id: memoryId, type });
}

export function trackAudioPlayback(memoryId: string, duration: number) {
  const { track } = useAnalytics();
  track('audio_played', { memory_id: memoryId, duration });
}

export function trackFeatureUsed(feature: string) {
  const { track } = useAnalytics();
  track('feature_used', { feature });
}
