"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const ChatDialog = dynamic(() => import('@/app/(components)/chat/ChatDialog'), {
  ssr: false
});

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center h-14 px-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <MessageCircle className="w-6 h-6 mr-2" />
            <p>Quick assist</p>
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center h-14 px-3 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <X className="w-6 h-6 mr-2" />
            <p>Close</p>
          </button>
        )}
      </div>

      {/* Chat Dialog */}
      <ChatDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatWidget;