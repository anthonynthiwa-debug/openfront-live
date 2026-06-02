import { list } from '@keystone-6/core';
import {
  text,
  timestamp,
  relationship,
  integer,
  select,
  json,
} from '@keystone-6/core/fields';
import { trackingFields } from './trackingFields';
import { permissions } from '../access';

export const StreamPurchase = list({
  access: {
    operation: {
      query: permissions.canManageOrders,
      create: () => true,
      update: permissions.canManageOrders,
      delete: permissions.canManageOrders,
    },
  },
  fields: {
    liveSession: relationship({
      ref: 'LiveSession.streamPurchases',
      many: false,
      validation: { isRequired: true },
    }),

    streamProduct: relationship({
      ref: 'StreamProduct.streamPurchases',
      many: false,
      validation: { isRequired: true },
    }),

    customer: relationship({
      ref: 'User.streamPurchases',
      many: false,
    }),

    customerEmail: text(),

    quantity: integer({
      validation: { isRequired: true },
      defaultValue: 1,
    }),

    unitPrice: integer({
      validation: { isRequired: true },
    }),

    totalAmount: integer({
      validation: { isRequired: true },
    }),

    currency: relationship({
      ref: 'Currency.streamPurchases',
      many: false,
      validation: { isRequired: true },
    }),

    paymentStatus: select({
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      validation: { isRequired: true },
    }),

    stripePaymentIntentId: text(),

    order: relationship({
      ref: 'Order.streamPurchases',
      many: false,
    }),

    purchasedAt: timestamp({
      validation: { isRequired: true },
    }),

    completedAt: timestamp(),

    metadata: json({
      defaultValue: {},
    }),

    notificationSent: text({
      defaultValue: 'pending',
    }),

    ...trackingFields,
  },
  hooks: {
    resolveInput({ operation, resolvedData }) {
      if (operation === 'create' && !resolvedData.purchasedAt) {
        resolvedData.purchasedAt = new Date().toISOString();
      }
      return resolvedData;
    },
  },
});
