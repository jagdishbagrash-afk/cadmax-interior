import React from 'react';

export const formatMultiPrice = (amount, currency) => {
  const formattedValue = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return formattedValue.replace(/(\D+)(\d)/, '$1 $2');
};

const Valuedata = () => {
  return (
    <>
    </>
  );
};

export default Valuedata;
