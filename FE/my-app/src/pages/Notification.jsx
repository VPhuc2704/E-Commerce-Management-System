import React from 'react';
import { motion } from 'framer-motion';

const Notification = ({ show, message, type }) => {
  if (!show) return null;

  const typeStyles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 p-4 rounded-lg border shadow-lg ${typeStyles[type] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
    >
      <p className="font-medium">{message}</p>
    </motion.div>
  );
};

export default Notification;