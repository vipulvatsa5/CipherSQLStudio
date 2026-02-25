import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import '../styles/Toast.scss';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {

    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ message, type = 'info', duration = 3000 }) => {

        const id = Date.now().toString();

        setToasts(prev => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => removeToast(id), duration);
        }

    }, []);

    const removeToast = useCallback((id) => {

        setToasts(prev => prev.filter(t => t.id !== id));

    }, []);

    const value = { addToast, removeToast };


    return (

        <ToastContext.Provider value={value}>

            {children}

            <div className="toast-container">

                {toasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        {...toast}
                        onRemove={removeToast}
                    />
                ))}

            </div>

        </ToastContext.Provider>

    );
};



const ToastItem = ({ id, message, type, onRemove }) => {

    const icons = {

        success: <FiCheckCircle color="#10b981" />,
        error: <FiAlertCircle color="#f43f5e" />,
        info: <FiInfo color="#6366f1" />,
        warning: <FiAlertCircle color="#f59e0b" />

    };


    return (

        <div className={`toast toast-${type}`}>

            <div className="toast-icon">
                {icons[type] || icons.info}
            </div>

            <div className="toast-content">
                {message}
            </div>

            <button
                className="toast-close"
                onClick={() => onRemove(id)}
            >
                <FiX />
            </button>

        </div>

    );

};