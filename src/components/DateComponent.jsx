import React from 'react';
import Moment from 'moment';

const DateComponent = ({ item }) => {
  const formattedDate = item ? Moment(item).format('D MMMM YYYY h:mmA') : '';

  return (
    <div>
      <div>{formattedDate}</div>
    </div>
  );
};
export default DateComponent;