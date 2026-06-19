// utils/productPrices.js
export const getProductPrices = (product) => {
  // If there's a top-level final_amount and it's > 0, use it directly
  if (product.final_amount && product.final_amount > 0) {
    return {
      displayPrice: product.final_amount,
      originalPrice: product.amount || product.final_amount,
    };
  }

  // Otherwise, scan all product_price_section entries
  const sections = product.product_price_section || [];
  let bestFinal = 0;
  let bestOriginal = 0;

  for (const section of sections) {
    // If the section has sizes, use the highest price among them
    if (section.sizes && section.sizes.length > 0) {
      for (const size of section.sizes) {
        const final = size.final_amount || size.amount || 0;
        if (final > 0 && final > bestFinal) {
          bestFinal = final;
          bestOriginal = size.amount || section.amount || 0;
        }
      }
    } else {
      // No sizes – use the section's own price
      const final = section.final_amount || section.amount || 0;
      if (final > 0 && final > bestFinal) {
        bestFinal = final;
        bestOriginal = section.amount || 0;
      }
    }
  }

  // Fallback to top-level amount if nothing found
  if (bestFinal === 0) {
    bestFinal = product.amount || 0;
    bestOriginal = product.amount || 0;
  }

  return {
    displayPrice: bestFinal,
    originalPrice: bestOriginal,
  };
};