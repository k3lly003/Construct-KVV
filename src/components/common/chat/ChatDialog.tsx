"use client";

import { useChat } from "@/app/hooks/useChat";
import { Message } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export const ChatDialog = () => {
  const { messages, sendMessage, isLoading } = useChat();

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message: Message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
};