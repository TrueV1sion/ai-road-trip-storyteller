import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  Platform 
} from 'react-native';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  React.useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  };

  const getToastIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} color="#ffffff" />;
      case 'error':
        return <AlertCircle size={20} color="#ffffff" />;
      case 'warning':
        return <AlertCircle size={20} color="#ffffff" />;
      case 'info':
      default:
        return <Info size={20} color="#ffffff" />;
    }
  };

  const getToastStyle = () => {
    switch (toast.type) {
      case 'success':
        return styles.successToast;
      case 'error':
        return styles.errorToast;
      case 'warning':
        return styles.warningToast;
      case 'info':
      default:
        return styles.infoToast;
    }
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        getToastStyle(),
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.toastContent}>
        <View style={styles.toastIcon}>
          {getToastIcon()}
        </View>
        <Text style={styles.toastMessage} numberOfLines={3}>
          {toast.message}
        </Text>
        <View style={styles.toastActions}>
          <Text onPress={handleDismiss} style={styles.dismissButton}>
            <X size={16} color="#ffffff" />
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, message: string, duration?: number) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = {
      id,
      type,
      message,
      duration,
    };

    setToasts(prev => [...prev, newToast]);
  };

  const success = (message: string, duration?: number) => {
    showToast('success', message, duration);
  };

  const error = (message: string, duration?: number) => {
    showToast('error', message, duration);
  };

  const info = (message: string, duration?: number) => {
    showToast('info', message, duration);
  };

  const warning = (message: string, duration?: number) => {
    showToast('warning', message, duration);
  };

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const value: ToastContextType = {
    success,
    error,
    info,
    warning,
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={dismiss}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 20,
  },
  toast: {
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successToast: {
    backgroundColor: '#22c55e',
  },
  errorToast: {
    backgroundColor: '#ef4444',
  },
  warningToast: {
    backgroundColor: '#f59e0b',
  },
  infoToast: {
    backgroundColor: '#3b82f6',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  toastIcon: {
    marginRight: 12,
  },
  toastMessage: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    lineHeight: 20,
  },
  toastActions: {
    marginLeft: 8,
  },
  dismissButton: {
    padding: 4,
  },
});