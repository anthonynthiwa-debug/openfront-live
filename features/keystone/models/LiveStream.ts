
import { list, graphql, group } from '@keystone-6/core';
import {
  text,
  select,
  timestamp,
  relationship,
  integer,
  virtual
} from '@keystone-6/core/fields';
import { permissions, rules, isSignedIn } from '../access';
import { trackingFields } from './trackingFields';

export const LiveStream = list({
  access: {
    operation: {
      query: () => true,
      create: permissions.canManageProducts,
      update: permissions.canManageProducts,
      delete: permissions.canManageProducts,
    },
    filter: {
      query: ({ session }) => {
        if (permissions.canManageProducts({ session })) {
          return true;
        }
        return {
          status: { equals: 'live' }
        };
      },
    }
  },
  fields: {
    title: text({ validation: { isRequired: true } }),
    description: text({ ui: { displayMode: 'textarea' } }),
    status: select({
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Live', value: 'live' },
        { label: 'Ended', value: 'ended' },
      ],
      defaultValue: 'draft',
      validation: { isRequired: true },
    }),
    agoraChannel: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    store: relationship({
      ref: 'Store.liveStreams',
      many: false,
      validation: { isRequired: true },
    }),
    featuredProduct: relationship({
      ref: 'Product',
      many: false,
    }),
    viewerCount: integer({ defaultValue: 0 }),
    startedAt: timestamp(),
    endedAt: timestamp(),
    ...trackingFields,
  },
  ui: {
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'status', 'store', 'startedAt'],
    },
  },
});
