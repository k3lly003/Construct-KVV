"use client";

import React from "react";

interface TypingIndicatorProps {
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  className = "",
}) => {
  return (
    <div className={`flex justify-start ${className}`}>
      <div className="max-w-[80%] p-3 rounded-lg bg-white text-gray-800 shadow-sm border">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-xs text-gray-500">
            KVV Construction Assistant is typing...
          </span>
        </div>

        {/* Animated dots */}
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms", animationDuration: "1.4s" }}
            ></div>
            <div
              className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "160ms", animationDuration: "1.4s" }}
            ></div>
            <div
              className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "320ms", animationDuration: "1.4s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
