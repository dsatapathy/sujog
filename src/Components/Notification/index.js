import React from 'react';
import './index.css'; // Import your CSS file for styles

const Notification = () => {
  const message = "SUJOG Portal will be undergoing server maintenance from 7:00 PM on 14th December 2024 to 7:00 PM on 15th December 2024. During this period, the portal will be temporarily unavailable.";

  return (
    <div className="notification-bar">
      <p className="notification-text">{message}</p>
    </div>
  );
};

export default Notification;
