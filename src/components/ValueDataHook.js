import React from 'react';

export const formatMultiPrice = (amount, currency) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency,
    currencyDisplay: "code", // Show 'USD' instead of '$'
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const Valuedata = () => {
  return (
    <>
    </>
  );
}

export default Valuedata;
