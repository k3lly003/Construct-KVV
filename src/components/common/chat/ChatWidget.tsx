"use client";

import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { GenericButton } from '@/components/ui/generic-button';
import ChatDialog from './ChatDialog';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <GenericButton
        variant="primary"
        size="lg"
        onClick={() => setIsOpen(true)}
        className="rounded-full p-4 shadow-lg"
        leftIcon={<MessageCircle className="h-6 w-6" />}
      >
        Quick help
      </GenericButton>
      <ChatDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default ChatWidget;