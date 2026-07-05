import { useState, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import { ShoppingBag, Check, Package, Truck, Shield } from "lucide-react";
import { toast } from "sonner";

// Product variant configurations
const LIPSTICK_COLORS = [
  { id: "rouge-passion", name: "Rouge Passion", hex: "#8B0000" },
  { id: "nude-silk", name: "Nude Silk", hex: "#C4956A" },
  { id: "berry-divine", name: "Berry Divine", hex: "#6B2D5B" },
  { id: "coral-sunset", name: "Coral Sunset", hex: "#E8735A" },
];

const LIP_GLOSS_COLORS = [
  { id: "crystal-rose", name: "Crystal Rosé", hex: "#E8A0BF" },
  { id: "champagne-kiss", name: "Champagne Kiss", hex: "#F5DEB3" },
  { id: "plum-velvet", name: "Plum Velvet", hex: "#8E4585" },
  { id: "peach-nectar", name: "Peach Nectar", hex: "#FFDAB9" },
];

const BRUSH_OPTIONS = [
  { id: "foundation-brush", name: "Foundation Brush" },
  { id: "powder-brush", name: "Powder Brush" },
  { id: "blush-brush", name: "Blush Brush" },
  { id: "contour-brush", name: "Contour Brush" },
  { id: "highlight-brush", name: "Highlight Brush" },
  { id: "eyeshadow-flat", name: "Eyeshadow Flat" },
  { id: "eyeshadow-blend", name: "Blending Brush" },
  { id: "liner-brush", name: "Liner Brush" },
  { id: "brow-brush", name: "Brow Brush" },
  { id: "lip-brush", name: "Lip Brush" },
  { id: "fan-brush", name: "Fan Brush" },
  { id: "kabuki-brush", name: "Kabuki Brush" },
];

const MATERIAL_OPTIONS = [
  { id: "nights", name: "Nights Edition", description: "Dark metal & matte black plastic" },
  { id: "classic", name: "Classic Edition", description: "White metal & pearl plastic" },
];

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug || "";
  const { isNight } = useTheme();
  const { formatPrice } = useCurrency();
  const { sessionId, refreshCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedBrush, setSelectedBrush] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string>(isNight ? "nights" : "classic");

  const { data: product, isLoading } = trpc.shop.getProductBySlug.useQuery({ slug });
  const { data: recommendations } = trpc.shop.getRecommendations.useQuery(
    { excludeSlug: slug },
    { enabled: !!slug }
  );

  const addToCartMutation = trpc.shop.addToCart.useMutation({
    onSuccess: () => {
      setAddedToCart(true);
      refreshCart();
      toast.success("Added to cart");
      setTimeout(() => setAddedToCart(false), 2000);
    },
  });

  const accentColor = isNight ? "#D4AF37" : "#C41E3A";
  const textColor = isNight ? "#f5f0e8" : "#0d0505";
  const mutedColor = isNight ? "rgba(245,240,232,0.5)" : "rgba(13,5,5,0.7)";
  const bgColor = isNight ? "#050505" : "#faf7f4";
  const surfaceColor = isNight ? "#0a0a0a" : "#ffffff";
  const borderColor = isNight ? "rgba(212,175,55,0.15)" : "rgba(184,150,14,0.25)";

  // Determine which variant UI to show based on product series
  const productSeries = product?.series || "";
  const isLipstick = productSeries === "lipstick";
  const isLipGloss = productSeries === "lip-gloss";
  const isPalette = productSeries === "palette";
  const isBrushes = productSeries === "brushes";
  const hasColorOptions = isLipstick || isLipGloss;

  const colorOptions = useMemo(() => {
    if (isLipstick) return LIPSTICK_COLORS;
    if (isLipGloss) return LIP_GLOSS_COLORS;
    return [];
  }, [isLipstick, isLipGloss]);

  // Set default color on first render
  if (hasColorOptions && !selectedColor && colorOptions.length > 0) {
    setSelectedColor(colorOptions[0].id);
  }
  if (isBrushes && !selectedBrush) {
    setSelectedBrush(BRUSH_OPTIONS[0].id);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        <div className="animate-pulse font-display text-2xl" style={{ color: mutedColor }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4" style={{ color: textColor }}>Product Not Found</h1>
          <Link href="/" className="text-sm underline" style={{ color: accentColor }}>Back to Home</Link>
        </div>
      </div>
    );
  }

  const features = product.features ? (typeof product.features === "string" ? JSON.parse(product.features) : product.features) as string[] : [];

  const handleAddToCart = () => {
    if (!sessionId) return;
    // Build variant string for the order
    let variant = "";
    if (hasColorOptions && selectedColor) {
      const color = colorOptions.find(c => c.id === selectedColor);
      variant = `Color: ${color?.name || selectedColor}`;
    }
    if (isBrushes && selectedBrush) {
      const brush = BRUSH_OPTIONS.find(b => b.id === selectedBrush);
      variant = `Type: ${brush?.name || selectedBrush}`;
    }
    const material = MATERIAL_OPTIONS.find(m => m.id === selectedMaterial);
    variant += `${variant ? " | " : ""}Edition: ${material?.name || selectedMaterial}`;

    addToCartMutation.mutate({ sessionId, productId: product.id, quantity, variant });
  };

  return (
    <div className="min-h-screen transition-colors duration-1000" style={{ backgroundColor: bgColor }}>
      <Navigation />

      <div className="pt-28 pb-20 px-6 md:px-10 max-w-[1200px] mx-auto">
        {/* Back link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <Link href="/#collection" className="font-sans text-[10px] tracking-[0.3em] uppercase opacity-60 hover:opacity-100 transition-opacity" style={{ color: accentColor }}>
            &larr; Back to Collections
          </Link>
        </motion.div>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Product Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="aspect-square rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: surfaceColor, border: `1px solid ${borderColor}` }}
          >
            <div className="text-center">
              <div
                className="w-32 h-32 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors duration-500"
                style={{
                  backgroundColor: hasColorOptions && selectedColor
                    ? `${colorOptions.find(c => c.id === selectedColor)?.hex || accentColor}25`
                    : `${accentColor}15`,
                }}
              >
                <Package size={48} style={{ color: hasColorOptions && selectedColor ? colorOptions.find(c => c.id === selectedColor)?.hex : accentColor }} />
              </div>
              <p className="font-display text-lg" style={{ color: textColor }}>{product.name}</p>
              {hasColorOptions && selectedColor && (
                <p className="font-sans text-xs mt-2" style={{ color: accentColor }}>
                  {colorOptions.find(c => c.id === selectedColor)?.name}
                </p>
              )}
              {isBrushes && selectedBrush && (
                <p className="font-sans text-xs mt-2" style={{ color: accentColor }}>
                  {BRUSH_OPTIONS.find(b => b.id === selectedBrush)?.name}
                </p>
              )}
              <p className="font-sans text-[10px] mt-1" style={{ color: mutedColor }}>
                {MATERIAL_OPTIONS.find(m => m.id === selectedMaterial)?.description}
              </p>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: accentColor }}>
              DIVIELLE &mdash; {product.series.replace("-", " ").toUpperCase()}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-light mb-4" style={{ color: textColor }}>
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <p className="font-display text-3xl" style={{ color: textColor }}>
                {formatPrice(Number(product.priceEur))}
              </p>
              <p className="font-sans text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: mutedColor }}>
                VAT included &bull; Free shipping
              </p>
            </div>

            {/* Description */}
            <p className="font-sans text-sm leading-relaxed mb-6" style={{ color: mutedColor }}>
              {product.longDescription || product.description}
            </p>

            {/* === COLOR SELECTION (Lipstick & Lip Gloss) === */}
            {hasColorOptions && (
              <div className="mb-6">
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: textColor }}>
                  Select Shade
                </p>
                <div className="flex items-center gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className="relative w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
                      style={{
                        backgroundColor: color.hex,
                        border: selectedColor === color.id ? `3px solid ${textColor}` : `2px solid ${borderColor}`,
                        boxShadow: selectedColor === color.id ? `0 0 0 2px ${color.hex}40` : "none",
                      }}
                      title={color.name}
                    >
                      {selectedColor === color.id && (
                        <Check size={14} className="absolute inset-0 m-auto" style={{ color: "#fff", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="font-sans text-xs mt-2" style={{ color: mutedColor }}>
                    {colorOptions.find(c => c.id === selectedColor)?.name}
                  </p>
                )}
              </div>
            )}

            {/* === PALETTE (single option) === */}
            {isPalette && (
              <div className="mb-6">
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: textColor }}>
                  Palette
                </p>
                <div className="p-4 rounded-xl" style={{ border: `2px solid ${accentColor}`, backgroundColor: `${accentColor}08` }}>
                  <p className="font-sans text-xs font-medium" style={{ color: textColor }}>DIVIELLE Signature Palette</p>
                  <p className="font-sans text-[10px] mt-1" style={{ color: mutedColor }}>12 curated shades &bull; Matte & shimmer finishes</p>
                </div>
              </div>
            )}

            {/* === BRUSH SELECTION (12 options) === */}
            {isBrushes && (
              <div className="mb-6">
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: textColor }}>
                  Select Brush Type
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BRUSH_OPTIONS.map((brush) => (
                    <button
                      key={brush.id}
                      onClick={() => setSelectedBrush(brush.id)}
                      className="px-3 py-2.5 rounded-lg text-left transition-all duration-300 hover:scale-[0.98]"
                      style={{
                        border: `1.5px solid ${selectedBrush === brush.id ? accentColor : borderColor}`,
                        backgroundColor: selectedBrush === brush.id ? `${accentColor}10` : "transparent",
                      }}
                    >
                      <span className="font-sans text-[11px]" style={{ color: selectedBrush === brush.id ? textColor : mutedColor }}>
                        {brush.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* === MATERIAL / EDITION SELECTION (Classic or Nights) === */}
            <div className="mb-6">
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: textColor }}>
                Edition
              </p>
              <div className="flex gap-3">
                {MATERIAL_OPTIONS.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => setSelectedMaterial(material.id)}
                    className="flex-1 p-4 rounded-xl text-left transition-all duration-300 hover:scale-[0.98]"
                    style={{
                      border: `2px solid ${selectedMaterial === material.id ? accentColor : borderColor}`,
                      backgroundColor: selectedMaterial === material.id ? `${accentColor}08` : "transparent",
                    }}
                  >
                    <p className="font-sans text-xs font-medium" style={{ color: textColor }}>{material.name}</p>
                    <p className="font-sans text-[10px] mt-0.5" style={{ color: mutedColor }}>{material.description}</p>
                    {selectedMaterial === material.id && (
                      <div className="mt-2 flex items-center gap-1">
                        <Check size={10} style={{ color: accentColor }} />
                        <span className="font-sans text-[9px]" style={{ color: accentColor }}>Selected</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: product.stock > 0 ? "#22c55e" : "#ef4444" }} />
              <span className="font-sans text-xs" style={{ color: mutedColor }}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center rounded-full overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 font-sans text-sm transition-colors hover:opacity-70"
                  style={{ color: textColor }}
                >
                  −
                </button>
                <span className="px-4 py-2 font-sans text-sm" style={{ color: textColor }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 font-sans text-sm transition-colors hover:opacity-70"
                  style={{ color: textColor }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addToCartMutation.isPending || (hasColorOptions && !selectedColor) || (isBrushes && !selectedBrush)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-sans text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:scale-[0.98] active:scale-[0.95] disabled:opacity-50"
                style={{
                  backgroundColor: addedToCart ? "#22c55e" : accentColor,
                  color: isNight ? "#050505" : "#ffffff",
                }}
              >
                {addedToCart ? <Check size={16} /> : <ShoppingBag size={16} />}
                {addedToCart ? "Added!" : "Add to Cart"}
              </button>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check size={12} style={{ color: accentColor }} />
                    <span className="font-sans text-xs" style={{ color: mutedColor }}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-6" style={{ borderTop: `1px solid ${borderColor}` }}>
              <div className="flex items-center gap-2">
                <Truck size={14} style={{ color: accentColor }} />
                <span className="font-sans text-[10px] uppercase tracking-wider" style={{ color: mutedColor }}>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} style={{ color: accentColor }} />
                <span className="font-sans text-[10px] uppercase tracking-wider" style={{ color: mutedColor }}>EU Certified</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Ingredients */}
        {product.ingredients && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 p-8 rounded-2xl"
            style={{ backgroundColor: surfaceColor, border: `1px solid ${borderColor}` }}
          >
            <h2 className="font-display text-xl font-light mb-4" style={{ color: textColor }}>Ingredients</h2>
            <p className="font-sans text-xs leading-relaxed" style={{ color: mutedColor }}>{product.ingredients}</p>
          </motion.div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl font-light mb-8" style={{ color: textColor }}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <Link key={rec.id} href={`/product/${rec.slug}`}>
                  <div
                    className="p-6 rounded-2xl transition-all duration-500 hover:scale-[0.98] cursor-pointer group"
                    style={{ backgroundColor: surfaceColor, border: `1px solid ${borderColor}` }}
                  >
                    <div className="aspect-square rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: `${accentColor}08` }}>
                      <Package size={36} style={{ color: accentColor }} className="opacity-40 group-hover:opacity-70 transition-opacity" />
                    </div>
                    <p className="font-sans text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: accentColor }}>
                      {rec.series.replace("-", " ")}
                    </p>
                    <h3 className="font-display text-lg font-light mb-2" style={{ color: textColor }}>{rec.name}</h3>
                    <p className="font-sans text-sm" style={{ color: accentColor }}>{formatPrice(Number(rec.priceEur))}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
