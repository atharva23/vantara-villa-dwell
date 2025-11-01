import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const WhatsAppFloat = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const whatsappNumber = "+918485099069"; // Your WhatsApp number
  const message = "Hi! I'm interested in learning more about your properties.";

  useEffect(() => {
    // Show button after a small delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1000);
    
    // Hide tooltip after 5 seconds
    const tooltipTimer = setTimeout(() => setShowTooltip(false), 5000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = whatsappNumber.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isVisible) return null;

  return (
    <>
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Tooltip */}
        {showTooltip && (
          <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-3 animate-in fade-in slide-in-from-right-4 duration-300">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
              Need help? Chat with us!
            </span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          className="group relative bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          {/* Pulse Animation */}
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
          
          {/* Icon */}
          <MessageCircle className="h-6 w-6 relative z-10" />
          
          {/* Badge for notification (optional) */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            1
          </span>
        </button>
      </div>

      {/* Mobile Tooltip (shows at bottom) */}
      {showTooltip && (
        <div className="sm:hidden fixed bottom-24 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg px-4 py-3 max-w-[200px]">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                Need help? Chat with us!
              </span>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppFloat;
