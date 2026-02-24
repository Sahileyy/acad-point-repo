import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        warning: <AlertTriangle className="text-amber-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
    };

    const bgColors = {
        success: "border-green-100 bg-white/80",
        error: "border-red-100 bg-white/80",
        warning: "border-amber-100 bg-white/80",
        info: "border-blue-100 bg-white/80",
    };

    return (
        <div className={`
            pointer-events-auto
            flex items-center gap-4 px-5 py-4 min-w-[300px] max-w-md
            liquid-glass rounded-2xl border ${bgColors[type] || bgColors.info}
            shadow-lg shadow-black/5 animate-in slide-in-from-right-8 duration-300
        `}>
            <div className="flex-shrink-0 p-2 bg-white/50 rounded-xl shadow-inner">
                {icons[type] || icons.info}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 leading-tight capitalize mb-0.5">
                    {type}
                </p>
                <p className="text-[13px] font-medium text-gray-500 leading-relaxed">
                    {message}
                </p>
            </div>

            <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 text-gray-400 transition"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
