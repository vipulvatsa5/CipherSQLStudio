import React from 'react';
const Loader = ({ text = "Loading..." }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            color: '#94a3b8'
        }}>
            <div
                animate={{
                    rotate: 360
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(99, 102, 241, 0.3)',
                    borderTop: '3px solid #6366f1',
                    borderRadius: '50%',
                    marginBottom: '1rem'
                }}
            />
            <p
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                style={{
                    fontSize: '0.9rem',
                    letterSpacing: '0.05em'
                }}
            >
                {text}
            </p>
        </div>
    );
};

export default Loader;
