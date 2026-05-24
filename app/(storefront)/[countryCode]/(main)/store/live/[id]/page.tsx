
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { gql } from 'graphql-request';
import { openfrontClient } from "@/features/storefront/lib/config";
import { LiveStreamPlayer } from "@/features/storefront/modules/store/components/LiveStreamPlayer";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `Live Stream ${params.id}`,
    description: "Watch live and shop now!",
  };
}

export default async function LiveStreamPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const query = gql`
    query GetLiveStream($id: ID!) {
      liveStream(where: { id: $id }) {
        id
        title
        description
        status
        agoraChannel
        featuredProduct {
          id
          title
          handle
          thumbnail
        }
      }
    }
  `;

  try {
    const response = await openfrontClient.request(query, { id });
    const liveStream = response.liveStream;

    if (!liveStream || liveStream.status !== 'live') {
      return notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{liveStream.title}</h1>
        {liveStream.description && <p className="text-gray-600 mb-8">{liveStream.description}</p>}

        <LiveStreamPlayer
          appId={process.env.NEXT_PUBLIC_AGORA_APP_ID || ''}
          channel={liveStream.agoraChannel}
          token="" // In a real app, you would fetch a subscriber token
          featuredProduct={liveStream.featuredProduct}
        />
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
