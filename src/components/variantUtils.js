/**
 * Centralized Frontend Variant Utility
 * 
 * Handles variant combination logic, cart item identification,
 * price resolution, and stock management for both
 * Normal and Variant products.
 */

/**
 * Generate a unique cart item ID for a variant combination
 * Uses: productId + sectionVariant + sizeVariant + colorVariant
 * Ensures each combination is treated as a separate cart item
 */
export function generateCartItemId(productId, sectionVariant, sizeVariant, colorVariant) {
  const parts = [productId];
  if (sectionVariant) parts.push(sectionVariant);
  if (sizeVariant) parts.push(sizeVariant);
  if (colorVariant) parts.push(colorVariant);
  return parts.join('___');
}

/**
 * Check if a product is a Variant Product (has product_price_section)
 */
export function isVariantProduct(product) {
  return product?.product_price_section?.length > 0;
}

/**
 * Check if a product is a Normal Product (single price, no sections)
 */
export function isNormalProduct(product) {
  return !isVariantProduct(product);
}

/**
 * Get the current price for a selected variant combination
 * 
 * For normal products: uses product.amount / product.final_amount
 * For variant products: uses section/size combination prices
 */
export function getCurrentVariantPrice(product, selectedPriceSection, selectedSize) {
  // If a size is selected within a price section
  if (selectedPriceSection && selectedSize) {
    return {
      amount: selectedSize.amount,
      final_amount: selectedSize.final_amount,
      discount_amount: selectedSize.discount_amount,
      fromSection: true
    };
  }
  // If only price section is selected (no size)
  if (selectedPriceSection) {
    return {
      amount: selectedPriceSection.amount,
      final_amount: selectedPriceSection.final_amount,
      discount_amount: selectedPriceSection.discount_amount,
      fromSection: true
    };
  }
  // Default product price
  return {
    amount: product?.amount || 0,
    final_amount: product?.final_amount || product?.amount || 0,
    discount_amount: product?.discount_amount || 0,
    fromSection: false
  };
}

/**
 * Get display price from a price data object
 */
export function getDisplayPrice(priceData) {
  if (!priceData) return 0;
  return priceData.final_amount > 0 ? priceData.final_amount : priceData.amount;
}

/**
 * Get available stock for the currently selected combination
 * 
 * For variant products: checks combination-level stock, falls back to color stock
 * For normal products: uses color variant stock
 */
export function getAvailableStock(product, selectedVariant, selectedPriceSection, selectedSize) {
  if (!product) return 0;
  
  // Try to get from selected variant first
  if (!selectedVariant) {
    // No variant selected yet, check product-level stock
    if (isNormalProduct(product)) {
      return product.variants?.[0]?.stock || 0;
    }
    return 0;
  }

  // For both normal and variant, the primary stock source is the color variant
  const colorStock = selectedVariant.stock || 0;
  
  // If it's a normal product, return color stock directly
  if (isNormalProduct(product)) {
    return colorStock;
  }

  // For variant products, ideally we'd check combination stocks if the backend provides them
  // For now, fall back to color-level stock
  return colorStock;
}

/**
 * Check if a specific variant combination is out of stock
 */
export function isCombinationOutOfStock(product, selectedVariant, selectedPriceSection, selectedSize) {
  return getAvailableStock(product, selectedVariant, selectedPriceSection, selectedSize) <= 0;
}

/**
 * Build a display-friendly variant label
 */
export function buildVariantLabel(product, selectedVariant, selectedPriceSection, selectedSize) {
  const parts = [product?.title || ''];
  
  if (selectedPriceSection?.title) {
    parts.push(selectedPriceSection.title);
  }
  if (selectedSize?.title) {
    parts.push(selectedSize.title);
  }
  if (selectedVariant?.color) {
    parts.push(selectedVariant.color);
  }
  
  return parts.join(' - ');
}

/**
 * Format price with ₹ symbol
 */
export function formatPrice(price) {
  if (!price || isNaN(price)) return '0';
  return Number(price).toLocaleString('en-IN');
}