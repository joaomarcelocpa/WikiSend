import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'warning';
    onClose: () => void;
    duration?: number;
}

const Toast = ({ message, type, onClose, duration = 5000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-high-data',
                    icon: <CheckCircle className="w-5 h-5" />,
                    border: 'border-max-data'
                };
            case 'error':
                return {
                    bg: 'bg-red-500',
                    icon: <XCircle className="w-5 h-5" />,
                    border: 'border-red-600'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-500',
                    icon: <AlertCircle className="w-5 h-5" />,
                    border: 'border-yellow-600'
                };
        }
    };

    const styles = getStyles();

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className={`${styles.bg} ${styles.border} border-l-4 rounded-lg shadow-lg p-4 min-w-[320px] max-w-md`}>
                <div className="flex items-start gap-3">
                    <div className="text-white flex-shrink-0 mt-0.5">
                        {styles.icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-medium text-sm leading-relaxed">
                            {message}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded p-1 transition-colors flex-shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;