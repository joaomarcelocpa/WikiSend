import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    darkMode: boolean;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog = ({
                           title,
                           message,
                           confirmText = 'Confirmar',
                           cancelText = 'Cancelar',
                           onConfirm,
                           onCancel,
                           darkMode,
                           type = 'danger'
                       }: ConfirmDialogProps) => {
    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    iconColor: 'text-red-500',
                    confirmBg: 'bg-red-500 hover:bg-red-600',
                    iconBg: 'bg-red-500/10'
                };
            case 'warning':
                return {
                    iconColor: 'text-yellow-500',
                    confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
                    iconBg: 'bg-yellow-500/10'
                };
            case 'info':
                return {
                    iconColor: 'text-blue-500',
                    confirmBg: 'bg-blue-500 hover:bg-blue-600',
                    iconBg: 'bg-blue-500/10'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className={`pointer-events-auto w-full max-w-md rounded-2xl shadow-2xl animate-scale-in ${
                        darkMode ? 'bg-[#1f1f1f] border-2 border-gray-700' : 'bg-white'
                    }`}
                >
                    {/* Header */}
                    <div className="p-6 pb-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className={`p-3 rounded-xl ${styles.iconBg} flex-shrink-0`}>
                                    <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-lg font-bold mb-2 font-heading ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {title}
                                    </h3>
                                    <p className={`text-sm leading-relaxed ${
                                        darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {message}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onCancel}
                                className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
                                    darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                                }`}
                            >
                                <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className={`p-6 pt-2 flex gap-3 justify-end ${
                        darkMode ? 'border-t border-gray-800' : 'border-t border-gray-100'
                    }`}>
                        <button
                            onClick={onCancel}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                                darkMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-5 py-2.5 rounded-xl font-bold text-white transition-all ${styles.confirmBg}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </>
    );
};

export default ConfirmDialog;