
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface LiveStream {
  id: string;
  title: string;
  store: {
    id: string;
    name: string;
  };
}

interface LiveNowSectionProps {
  liveStreams: LiveStream[];
}

export const LiveNowSection: React.FC<LiveNowSectionProps> = ({ liveStreams }) => {
  if (liveStreams.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Live Now 🔴</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveStreams.map((stream) => (
            <Link key={stream.id} href={`/store/live/${stream.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle>{stream.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Streaming from: {stream.store.name}</p>
                  <div className="mt-4 inline-block bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-bold animate-pulse">
                    Watch Live
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
