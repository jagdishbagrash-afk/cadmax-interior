export const formatPrice = (price) => {
  if (!price) return "0.00";

  return Number(price).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
