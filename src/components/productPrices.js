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

  if (sections.length > 0) {
    const firstSection = sections[0];

    // If sizes exist
    if (firstSection?.sizes?.length > 0) {
      const firstSize = firstSection.sizes[0];

      return {
        displayPrice:
          Number(firstSize?.final_amount) ||
          Number(firstSize?.amount) ||
          0,
        originalPrice:
          Number(firstSize?.amount) ||
          Number(firstSection?.amount) ||
          0,
      };
    }

    // Section level price
    return {
      displayPrice:
        Number(firstSection?.final_amount) ||
        Number(firstSection?.amount) ||
        0,
      originalPrice:
        Number(firstSection?.amount) ||
        Number(firstSection?.final_amount) ||
        0,
    };
  }

  return {
    displayPrice: Number(product?.amount) || 0,
    originalPrice: Number(product?.amount) || 0,
  };
};