
import { list } from "@keystone-6/core";
import { denyAll } from "@keystone-6/core/access";
import {
  checkbox,
  integer,
  json,
  text,
  timestamp,
  relationship,
  virtual,
} from "@keystone-6/core/fields";
import { permissions, rules, isSignedIn } from "../access";
import { trackingFields } from "./trackingFields";
import { graphql } from "@keystone-6/core";

export const PaymentSession = list({
  access: {
    operation: {
      query: isSignedIn,
      create: permissions.canManagePayments,
      update: permissions.canManagePayments,
      delete: permissions.canManagePayments,
    },
    filter: {
      query: rules.canReadOwnPaymentSession,
    },
  },
  fields: {
    isSelected: checkbox({
      defaultValue: false,
    }),
    isInitiated: checkbox({
      defaultValue: false,
    }),
    amount: integer({
      validation: { isRequired: true },
    }),
    formattedAmount: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item, args, context) {
          const { paymentCollection } = await context.query.PaymentSession.findOne({
            where: { id: item.id },
            query: `
              paymentCollection {
                cart {
                  order {
                    currency {
                      code
                      symbol
                    }
                  }
                }
              }
            `
          });

          if (!paymentCollection?.cart?.order?.currency) {
            return `${item.amount / 100}`;
          }

          const { symbol } = paymentCollection.cart.order.currency;
          const amount = item.amount / 100;
          return `${symbol}${amount.toFixed(2)}`;
        }
      })
    }),
    data: json({
      defaultValue: {},
    }),
    idempotencyKey: text({
      isIndexed: true,
    }),
    paymentCollection: relationship({
      ref: "PaymentCollection.paymentSessions",
    }),
    paymentProvider: relationship({
      ref: "PaymentProvider.sessions",
      many: false,
    }),
    paymentAuthorizedAt: timestamp(),
    ...trackingFields,
  },
});
