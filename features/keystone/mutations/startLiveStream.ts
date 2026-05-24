
import { KeystoneContext } from '@keystone-6/core/types';
import { generateAgoraToken } from '../utils/agora';

export default async function startLiveStream(
  root: any,
  { storeId, title, description }: { storeId: string; title: string; description?: string },
  context: KeystoneContext
) {
  if (!context.session?.itemId) {
    throw new Error('You must be logged in to start a live stream.');
  }

  const store = await context.sudo().query.Store.findOne({
    where: { id: storeId },
    query: 'id name',
  });

  if (!store) {
    throw new Error('Store not found.');
  }

  const channelName = `store-${storeId}-${Date.now()}`;
  const uid = 1; // Merchant is always 1
  const token = await generateAgoraToken(channelName, uid, 'publisher');

  const liveStream = await context.sudo().query.LiveStream.createOne({
    data: {
      title,
      description,
      status: 'live',
      agoraChannel: channelName,
      store: { connect: { id: storeId } },
      startedAt: new Date().toISOString(),
    },
    query: 'id title status agoraChannel startedAt',
  });

  return {
    ...liveStream,
    token,
    uid,
  };
}
