import React, { createContext, useContext, useState } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { Toast, ToastViewport } from '../components/Toast/Toast';

interface ToastContextType {
  showToast: (props: { title?: string; description: string; type?: 'info' | 'error' | 'success' }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{ id: number } & Parameters<ToastContextType['showToast']>[0]>>([]);

  const showToast = (props: Parameters<ToastContextType['showToast']>[0]) => {
    const id = Date.now();
    setToasts(current => [...current, { ...props, id }]);
    setTimeout(() => {
      setToasts(current => current.filter(toast => toast.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastPrimitive.Provider>
        {children}
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
        <ToastViewport />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
