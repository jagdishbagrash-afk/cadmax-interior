// utils/productPrices.js

export const getProductPrices = (product = {}) => {
  if (!product || typeof product !== "object") {
    return {
      displayPrice: 0,
      originalPrice: 0,
    };
  }

  // Top-level price
  if ((product?.final_amount ?? 0) > 0) {
    return {
      displayPrice: Number(product.final_amount) || 0,
      originalPrice:
        Number(product.amount) || Number(product.final_amount) || 0,
    };
  }

  const sections = Array.isArray(product?.product_price_section)
    ? product.product_price_section
    : [];

  let bestFinal = 0;
  let bestOriginal = 0;

  for (const section of sections) {
    if (!section) continue;

    const sizes = Array.isArray(section?.sizes)
      ? section.sizes
      : [];

    if (sizes.length > 0) {
      for (const size of sizes) {
        if (!size) continue;

        const final =
          Number(size?.final_amount) ||
          Number(size?.amount) ||
          0;

        if (final > 0 && final > bestFinal) {
          bestFinal = final;
          bestOriginal =
            Number(size?.amount) ||
            Number(section?.amount) ||
            final;
        }
      }
    } else {
      const final =
        Number(section?.final_amount) ||
        Number(section?.amount) ||
        0;

      if (final > 0 && final > bestFinal) {
        bestFinal = final;
        bestOriginal = Number(section?.amount) || final;
      }
    }
  }

  if (bestFinal === 0) {
    bestFinal = Number(product?.amount) || 0;
    bestOriginal = Number(product?.amount) || 0;
  }

  return {
    displayPrice: bestFinal,
    originalPrice: bestOriginal,
  };
};