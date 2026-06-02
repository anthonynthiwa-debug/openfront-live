import { list } from '@keystone-6/core';
import {
  text,
  timestamp,
  relationship,
  checkbox,
  integer,
  select,
  json,
} from '@keystone-6/core/fields';
import { trackingFields } from './trackingFields';
import { permissions } from '../access';

export const LiveSession = list({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageProducts,
      update: permissions.canManageProducts,
      delete: permissions.canManageProducts,
    },
  },
  fields: {
    sessionId: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),

    title: text({
      validation: { isRequired: true },
    }),

    description: text({
      ui: { displayMode: 'textarea' },
    }),

    merchant: relationship({
      ref: 'User.liveSessions',
      many: false,
    }),

    status: select({
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Active', value: 'active' },
        { label: 'Ended', value: 'ended' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'scheduled',
      validation: { isRequired: true },
    }),

    agoraChannelName: text({
      validation: { isRequired: true },
    }),

    agoraChannelId: text(),

    scheduledStartTime: timestamp({
      validation: { isRequired: true },
    }),

    actualStartTime: timestamp(),

    endTime: timestamp(),

    viewerCount: integer({
      defaultValue: 0,
    }),

    peakViewerCount: integer({
      defaultValue: 0,
    }),

    totalViews: integer({
      defaultValue: 0,
    }),

    totalPurchases: integer({
      defaultValue: 0,
    }),

    totalRevenue: integer({
      defaultValue: 0,
    }),

    region: relationship({
      ref: 'Region.liveSessions',
      many: false,
      validation: { isRequired: true },
    }),

    thumbnailUrl: text(),

    streamProducts: relationship({
      ref: 'StreamProduct.liveSession',
      many: true,
    }),

    streamPurchases: relationship({
      ref: 'StreamPurchase.liveSession',
      many: true,
    }),

    broadcastMetadata: json({
      defaultValue: {},
    }),

    isActive: checkbox({
      defaultValue: false,
    }),

    ...trackingFields,
  },
  hooks: {
    resolveInput({ operation, resolvedData }) {
      if (operation === 'create' && !resolvedData.sessionId) {
        const timestamp = Date.now();
        resolvedData.sessionId = `live_${new Date().getFullYear()}_${String(timestamp).slice(-8)}`;
      }
      return resolvedData;
    },
  },
});
