import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import { Trash2, Minus, Plus, Tag, ShoppingBag, Truck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const { isNight } = useTheme();
  const { formatPrice, convert, symbol } = useCurrency();
  const { sessionId, refreshCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  // Restore coupon from localStorage on mount
  const revalidateCoupon = trpc.shop.validateCoupon.useMutation({
    onSuccess: (data) => {
      const savedCode = localStorage.getItem("divielle-applied-coupon");
      if (data.valid && savedCode) {
        setAppliedCoupon({ code: savedCode, percent: data.discountPercent });
      } else {
        localStorage.removeItem("divielle-applied-coupon");
      }
    },
  });

  useEffect(() => {
    const savedCoupon = localStorage.getItem("divielle-applied-coupon");
    if (savedCoupon) {
      setCouponCode(savedCoupon);
      revalidateCoupon.mutate({ code: savedCoupon });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: cartItems, isLoading } = trpc.shop.getCart.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const updateQuantityMutation = trpc.shop.updateCartQuantity.useMutation({
    onSuccess: () => refreshCart(),
  });

  const removeItemMutation = trpc.shop.removeFromCart.useMutation({
    onSuccess: () => {
      refreshCart();
      toast.success("Item removed");
    },
  });

  const validateCouponMutation = trpc.shop.validateCoupon.useMutation({
    onSuccess: (data) => {
      if (data.valid) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), percent: data.discountPercent });
        setCouponError("");
        localStorage.setItem("divielle-applied-coupon", couponCode.toUpperCase());
        toast.success(`Coupon applied! ${data.discountPercent}% off`);
      } else {
        setCouponError("Invalid or expired coupon");
        setAppliedCoupon(null);
        localStorage.removeItem("divielle-applied-coupon");
      }
    },
  });

  const accentColor = isNight ? "#D4AF37" : "#C41E3A";
  const textColor = isNight ? "#f5f0e8" : "#0d0505";
  const mutedColor = isNight ? "rgba(245,240,232,0.5)" : "rgba(13,5,5,0.7)";
  const bgColor = isNight ? "#050505" : "#faf7f4";
  const surfaceColor = isNight ? "#0a0a0a" : "#ffffff";
  const borderColor = isNight ? "rgba(212,175,55,0.15)" : "rgba(212,175,55,0.25)";

  const subtotal = cartItems?.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + convert(Number(item.product.priceEur)) * item.quantity;
  }, 0) || 0;

  const discount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.percent / 100) * 100) / 100 : 0;
  const total = Math.round((subtotal - discount) * 100) / 100;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    validateCouponMutation.mutate({ code: couponCode.trim() });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    localStorage.removeItem("divielle-applied-coupon");
  };

  return (
    <div className="min-h-screen transition-colors duration-1000" style={{ backgroundColor: bgColor }}>
      <Navigation />

      <div className="pt-28 pb-20 px-6 md:px-10 max-w-[1000px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl md:text-4xl font-light mb-2" style={{ color: textColor }}>
            Your <span className="italic" style={{ color: accentColor }}>Cart</span>
          </h1>
          <p className="font-sans text-xs" style={{ color: mutedColor }}>
            {cartItems?.length || 0} item{(cartItems?.length || 0) !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-pulse font-display text-xl" style={{ color: mutedColor }}>Loading cart...</div>
          </div>
        ) : !cartItems || cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" style={{ color: accentColor }} />
            <p className="font-display text-xl mb-4" style={{ color: textColor }}>Your cart is empty</p>
            <Link href="/#collection">
              <button
                className="px-6 py-3 rounded-full font-sans text-xs tracking-[0.15em] uppercase transition-all hover:scale-[0.98]"
                style={{ backgroundColor: accentColor, color: isNight ? "#050505" : "#ffffff" }}
              >
                Explore Collections
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex items-center gap-4 p-5 rounded-2xl"
                    style={{ backgroundColor: surfaceColor, border: `1px solid ${borderColor}` }}
                  >
                    {/* Product thumbnail placeholder */}
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}10` }}>
                      <ShoppingBag size={20} style={{ color: accentColor }} className="opacity-50" />
                    </div>

                    {/* Product info */}
                    <div className="flex-1">
                      <Link href={`/product/${item.product?.slug}`}>
                        <h3 className="font-display text-sm font-light hover:underline cursor-pointer" style={{ color: textColor }}>
                          {item.product?.name || "Unknown Product"}
                        </h3>
                      </Link>
                      {item.variant && (
                        <p className="font-sans text-[10px] mt-0.5" style={{ color: accentColor }}>
                          {item.variant}
                        </p>
                      )}
                      <p className="font-sans text-xs mt-1" style={{ color: mutedColor }}>
                        {item.product ? formatPrice(Number(item.product.priceEur)) : "—"} each
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 rounded-full" style={{ border: `1px solid ${borderColor}` }}>
                      <button
                        onClick={() => updateQuantityMutation.mutate({ cartItemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                        className="p-2 transition-opacity hover:opacity-70"
                      >
                        <Minus size={12} style={{ color: textColor }} />
                      </button>
                      <span className="px-3 font-sans text-xs" style={{ color: textColor }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantityMutation.mutate({ cartItemId: item.id, quantity: item.quantity + 1 })}
                        className="p-2 transition-opacity hover:opacity-70"
                      >
                        <Plus size={12} style={{ color: textColor }} />
                      </button>
                    </div>

                    {/* Item total */}
                    <span className="font-sans text-sm w-20 text-right" style={{ color: textColor }}>
                      {item.product ? `${symbol}${(convert(Number(item.product.priceEur)) * item.quantity).toFixed(2)}` : "—"}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeItemMutation.mutate({ cartItemId: item.id })}
                      className="p-2 transition-opacity hover:opacity-70"
                    >
                      <Trash2 size={14} style={{ color: mutedColor }} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 p-6 rounded-2xl" style={{ backgroundColor: surfaceColor, border: `1px solid ${borderColor}` }}>
                <h2 className="font-display text-lg font-light mb-6" style={{ color: textColor }}>Order Summary</h2>

                {/* Subtotal */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-sans text-xs" style={{ color: mutedColor }}>Subtotal</span>
                  <span className="font-sans text-sm" style={{ color: textColor }}>{symbol}{subtotal.toFixed(2)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-sans text-xs flex items-center gap-1" style={{ color: mutedColor }}>
                    <Truck size={12} /> Shipping
                  </span>
                  <span className="font-sans text-xs font-medium" style={{ color: "#22c55e" }}>FREE</span>
                </div>

                {/* Discount */}
                {appliedCoupon && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-sans text-xs flex items-center gap-1" style={{ color: "#22c55e" }}>
                      <Tag size={12} /> Discount ({appliedCoupon.percent}%)
                    </span>
                    <span className="font-sans text-sm" style={{ color: "#22c55e" }}>-{symbol}{discount.toFixed(2)}</span>
                  </div>
                )}

                {/* Divider */}
                <div className="my-4" style={{ borderTop: `1px solid ${borderColor}` }} />

                {/* Total */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-sans text-sm font-medium" style={{ color: textColor }}>Total</span>
                  <span className="font-display text-xl" style={{ color: textColor }}>{symbol}{total.toFixed(2)}</span>
                </div>
                <p className="font-sans text-[10px] mb-6" style={{ color: mutedColor }}>
                  VAT included in all prices
                </p>

                {/* Coupon Input */}
                <div className="mb-6">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-full" style={{ backgroundColor: `${accentColor}10`, border: `1px solid ${accentColor}33` }}>
                      <span className="font-sans text-xs flex items-center gap-2" style={{ color: accentColor }}>
                        <Tag size={12} /> {appliedCoupon.code}
                      </span>
                      <button onClick={handleRemoveCoupon} className="font-sans text-[10px] underline" style={{ color: mutedColor }}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                        className="flex-1 px-4 py-2.5 rounded-full font-sans text-xs outline-none"
                        style={{ backgroundColor: bgColor, color: textColor, border: `1px solid ${borderColor}` }}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={validateCouponMutation.isPending}
                        className="px-4 py-2.5 rounded-full font-sans text-[10px] tracking-[0.1em] uppercase transition-all hover:scale-[0.98]"
                        style={{ backgroundColor: accentColor, color: isNight ? "#050505" : "#ffffff" }}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="font-sans text-[10px] mt-2 text-red-500">{couponError}</p>
                  )}
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-sans text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:scale-[0.98] active:scale-[0.95]"
                    style={{ backgroundColor: accentColor, color: isNight ? "#050505" : "#ffffff" }}
                  >
                    Proceed to Checkout <ArrowRight size={14} />
                  </button>
                </Link>

                {/* Continue shopping */}
                <Link href="/#collection">
                  <p className="text-center mt-4 font-sans text-[10px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-opacity cursor-pointer" style={{ color: accentColor }}>
                    Continue Shopping
                  </p>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
