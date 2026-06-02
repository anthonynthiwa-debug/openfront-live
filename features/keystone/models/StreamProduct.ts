import { list } from '@keystone-6/core';
import {
  text,
  timestamp,
  relationship,
  integer,
  checkbox,
  json,
} from '@keystone-6/core/fields';
import { trackingFields } from './trackingFields';
import { permissions } from '../access';

export const StreamProduct = list({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageProducts,
      update: permissions.canManageProducts,
      delete: permissions.canManageProducts,
    },
  },
  fields: {
    liveSession: relationship({
      ref: 'LiveSession.streamProducts',
      many: false,
    }),

    product: relationship({
      ref: 'Product.streamProducts',
      many: false,
      validation: { isRequired: true },
    }),

    variant: relationship({
      ref: 'ProductVariant.streamProducts',
      many: false,
    }),

    featuredAt: timestamp({
      validation: { isRequired: true },
    }),

    removedAt: timestamp(),

    sequenceOrder: integer({
      validation: { isRequired: true },
    }),

    streamPrice: integer(),

    discount: integer({
      defaultValue: 0,
    }),

    impressions: integer({
      defaultValue: 0,
    }),

    clicks: integer({
      defaultValue: 0,
    }),

    purchases: integer({
      defaultValue: 0,
    }),

    conversionRate: text(),

    quantity: integer({
      validation: { isRequired: true },
      defaultValue: 999,
    }),

    quantitySold: integer({
      defaultValue: 0,
    }),

    isAvailable: checkbox({
      defaultValue: true,
    }),

    description: text({
      ui: { displayMode: 'textarea' },
    }),

    metadata: json({
      defaultValue: {},
    }),

    streamPurchases: relationship({
      ref: 'StreamPurchase.streamProduct',
      many: true,
    }),

    ...trackingFields,
  },
});
