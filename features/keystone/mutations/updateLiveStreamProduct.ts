
import { KeystoneContext } from '@keystone-6/core/types';

export default async function updateLiveStreamProduct(
  root: any,
  { liveStreamId, productId }: { liveStreamId: string; productId: string },
  context: KeystoneContext
) {
  if (!context.session?.itemId) {
    throw new Error('You must be logged in to update the featured product.');
  }

  return await context.sudo().query.LiveStream.updateOne({
    where: { id: liveStreamId },
    data: {
      featuredProduct: { connect: { id: productId } },
    },
    query: 'id featuredProduct { id title handle }',
  });
}
