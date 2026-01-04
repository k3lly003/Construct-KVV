"use client";

import React, { useEffect } from 'react';
import { X, MessageCircle, Send, Construction, Drill, Pickaxe, BrickWall } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatDialogProps } from '@/app/utils/dtos/chat.dtos';
import { quickActions } from '@/app/utils/fakes/ChatFakes';
import { useHandleSendMessages } from '@/app/hooks/useSendMessages';

const ChatDialog: React.FC<ChatDialogProps> = ({ isOpen, onClose }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { messages, setMessages, inputValue, setInputValue, handleQuickAction, handleSendMessage } = useHandleSendMessages();

  // Dialog-specific useEffect for Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose])

  const dialogVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      x: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: 100,
      x: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 flex flex-col bg-white rounded-lg shadow-2xl w-80 h-[450px] pointer-events-auto"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* HEADER */}
          <div className="bg-amber-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full grid grid-cols-2 grid-rows-2 place-items-center gap-1 p-1">
                <Pickaxe className="w-3 h-3 text-amber-500" />
                <Construction className='w-3 h-3 text-amber-500'/>
                <BrickWall className='w-3 h-3 text-amber-500'/>
                <Drill className='w-3 h-3 text-amber-500'/>
              </div>
              <h3 className="font-semibold text-md">Kvv Construction Assistant</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-amber-600 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-amber-500 text-white'
                      : 'bg-white text-gray-800 shadow-sm border'
                  }`}
                >
                  {!message.isUser && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                  <p className="text-small leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            {/* Display quick actions only if there's only the initial message */}
            {messages.length === 1 && (
              <div className="space-y-3 mt-4">
                <p className="text-small text-gray-600 font-medium">What would you like to do?</p>
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="w-full justify-start text-amber-600 border-2 border-amber-500 hover:bg-emerald-50 hover:border-amber-300 transition-colors"
                      onClick={() => handleQuickAction(action)}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Choose an option or type your message..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} // Call the returned handleSendMessage
              />
              <button
                onClick={handleSendMessage} // Call the returned handleSendMessage
                className="bg-amber-500 hover:bg-amber-600 text-white px-2"
              >
                <Send className="text-mid w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatDialog;