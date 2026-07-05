import { z } from "zod";
import { eq, and, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import {
  products,
  reviews,
  cartItems,
  orders,
  orderItems,
  newsletter,
  coupons,
} from "../drizzle/schema";

// Currency conversion rates (base: EUR)
const CURRENCY_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.86,
  CHF: 0.97,
  SEK: 11.42,
  NOK: 11.65,
  DKK: 7.46,
  PLN: 4.32,
  CZK: 25.15,
};

function convertPrice(eurPrice: number, currency: string): number {
  const rate = CURRENCY_RATES[currency] || 1;
  return Math.round(eurPrice * rate * 100) / 100;
}

export const shopRouter = router({
  // --- Products ---
  getProducts: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
    return db.select().from(products);
  }),

  getProductBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const result = await db.select().from(products).where(eq(products.slug, input.slug)).limit(1);
      if (!result.length) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      return result[0];
    }),

  getRecommendations: publicProcedure
    .input(z.object({ excludeSlug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      return db.select().from(products).where(ne(products.slug, input.excludeSlug));
    }),

  getReviews: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      return db.select().from(reviews).where(eq(reviews.productId, input.productId));
    }),

  addReview: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        authorName: z.string().min(1),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.insert(reviews).values(input);
      return { success: true };
    }),

  // --- Cart ---
  getCart: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const items = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.sessionId, input.sessionId));

      // Fetch product details for each cart item
      const enriched = await Promise.all(
        items.map(async (item) => {
          const product = await db
            .select()
            .from(products)
            .where(eq(products.id, item.productId))
            .limit(1);
          return { ...item, product: product[0] || null };
        })
      );
      return enriched;
    }),

  addToCart: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        productId: z.number(),
        quantity: z.number().min(1).default(1),
        variant: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      // Check if same item + variant already in cart
      const existing = await db
        .select()
        .from(cartItems)
        .where(
          and(eq(cartItems.sessionId, input.sessionId), eq(cartItems.productId, input.productId))
        );

      const matchingVariant = existing.find(e => (e.variant || "") === (input.variant || ""));

      if (matchingVariant) {
        await db
          .update(cartItems)
          .set({ quantity: matchingVariant.quantity + input.quantity })
          .where(eq(cartItems.id, matchingVariant.id));
      } else {
        await db.insert(cartItems).values({
          sessionId: input.sessionId,
          productId: input.productId,
          quantity: input.quantity,
          variant: input.variant || null,
        });
      }
      return { success: true };
    }),

  updateCartQuantity: publicProcedure
    .input(z.object({ cartItemId: z.number(), quantity: z.number().min(0) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      if (input.quantity === 0) {
        await db.delete(cartItems).where(eq(cartItems.id, input.cartItemId));
      } else {
        await db.update(cartItems).set({ quantity: input.quantity }).where(eq(cartItems.id, input.cartItemId));
      }
      return { success: true };
    }),

  removeFromCart: publicProcedure
    .input(z.object({ cartItemId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.delete(cartItems).where(eq(cartItems.id, input.cartItemId));
      return { success: true };
    }),

  clearCart: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.delete(cartItems).where(eq(cartItems.sessionId, input.sessionId));
      return { success: true };
    }),

  // --- Coupons ---
  validateCoupon: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const result = await db
        .select()
        .from(coupons)
        .where(eq(coupons.code, input.code.toUpperCase()))
        .limit(1);

      if (!result.length || !result[0].active) {
        return { valid: false, discountPercent: 0 };
      }

      const coupon = result[0];
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return { valid: false, discountPercent: 0 };
      }

      return { valid: true, discountPercent: coupon.discountPercent };
    }),

  // --- Orders ---
  createOrder: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        email: z.string().email(),
        fullName: z.string().min(1),
        address: z.string().min(1),
        city: z.string().min(1),
        postalCode: z.string().min(1),
        country: z.string().min(1),
        phone: z.string().optional(),
        couponCode: z.string().optional(),
        currency: z.string().default("EUR"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      // Get cart items
      const items = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.sessionId, input.sessionId));

      if (!items.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cart is empty" });
      }

      // Calculate subtotal
      let subtotal = 0;
      const itemDetails: { productId: number; productName: string; quantity: number; unitPrice: number; variant: string | null }[] = [];

      for (const item of items) {
        const product = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);
        if (product.length) {
          const price = convertPrice(Number(product[0].priceEur), input.currency);
          subtotal += price * item.quantity;
          itemDetails.push({
            productId: item.productId,
            productName: product[0].name,
            quantity: item.quantity,
            unitPrice: price,
            variant: item.variant || null,
          });
        }
      }

      // Apply coupon
      let discount = 0;
      if (input.couponCode) {
        const coupon = await db
          .select()
          .from(coupons)
          .where(eq(coupons.code, input.couponCode.toUpperCase()))
          .limit(1);
        if (coupon.length && coupon[0].active) {
          discount = Math.round(subtotal * (coupon[0].discountPercent / 100) * 100) / 100;
          // Increment usage
          await db
            .update(coupons)
            .set({ usageCount: coupon[0].usageCount + 1 })
            .where(eq(coupons.id, coupon[0].id));
        }
      }

      const total = Math.round((subtotal - discount) * 100) / 100;

      // Create order
      const [orderResult] = await db.insert(orders).values({
        sessionId: input.sessionId,
        email: input.email,
        fullName: input.fullName,
        address: input.address,
        city: input.city,
        postalCode: input.postalCode,
        country: input.country,
        phone: input.phone || null,
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        total: total.toFixed(2),
        currency: input.currency,
        couponCode: input.couponCode || null,
        status: "pending",
      });

      const orderId = orderResult.insertId;

      // Create order items
      for (const item of itemDetails) {
        await db.insert(orderItems).values({
          orderId,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toFixed(2),
          variant: item.variant,
        });

        // Decrease stock
        const product = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
        if (product.length) {
          const newStock = Math.max(0, product[0].stock - item.quantity);
          await db.update(products).set({ stock: newStock }).where(eq(products.id, item.productId));
        }
      }

      // Clear cart
      await db.delete(cartItems).where(eq(cartItems.sessionId, input.sessionId));

      return { success: true, orderId, total, currency: input.currency };
    }),

  // --- Newsletter ---
  subscribeNewsletter: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      try {
        await db.insert(newsletter).values({ email: input.email });
        return { success: true, message: "Subscribed successfully" };
      } catch (e: any) {
        if (e?.code === "ER_DUP_ENTRY") {
          return { success: true, message: "Already subscribed" };
        }
        throw e;
      }
    }),

  // --- Currency conversion helper ---
  convertPrice: publicProcedure
    .input(z.object({ priceEur: z.number(), currency: z.string() }))
    .query(({ input }) => {
      return {
        price: convertPrice(input.priceEur, input.currency),
        currency: input.currency,
        symbol: getCurrencySymbol(input.currency),
      };
    }),

  getCurrencyRates: publicProcedure.query(() => {
    return CURRENCY_RATES;
  }),
});

function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    CHF: "CHF",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    PLN: "zł",
    CZK: "Kč",
  };
  return symbols[currency] || currency;
}
