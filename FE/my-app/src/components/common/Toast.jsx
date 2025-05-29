import React, { useEffect } from 'react';

const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 10000); // 3 giây tự tắt

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div style={{
            position: 'fixed',
            top: 20,
            right: 20,
            backgroundColor: '#4BB543', // màu xanh lá
            color: 'white',
            padding: '12px 20px',
            borderRadius: 5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 9999,
            animation: 'fadein 0.5s, fadeout 0.5s 2.5s',
            fontWeight: 'bold',
            fontSize: 16,
            maxWidth: 300,
        }}>
            {message}
            <style>{`
        @keyframes fadein {
          from {opacity: 0; transform: translateY(-10px);}
          to {opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeout {
          from {opacity: 1; transform: translateY(0);}
          to {opacity: 0; transform: translateY(-10px);}
        }
      `}</style>
        </div>
    );
};

export default Toast;
