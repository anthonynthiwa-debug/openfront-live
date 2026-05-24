
import { KeystoneContext } from '@keystone-6/core/types';

export default async function stopLiveStream(
  root: any,
  { liveStreamId }: { liveStreamId: string },
  context: KeystoneContext
) {
  if (!context.session?.itemId) {
    throw new Error('You must be logged in to stop a live stream.');
  }

  return await context.sudo().query.LiveStream.updateOne({
    where: { id: liveStreamId },
    data: {
      status: 'ended',
      endedAt: new Date().toISOString(),
    },
    query: 'id title status endedAt',
  });
}
