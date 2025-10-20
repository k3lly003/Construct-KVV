"use client";

import { useState } from "react";
import { Message } from "@/app/utils/dtos/chat.dtos";

export function useHandleSendMessages() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi, do you have any questions? I'm happy to help.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickAction = (action: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: action,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    // Simulate assistant response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'd be happy to help you ${action.toLowerCase()}. Let me provide you with detailed information about that topic.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSendMessage = async () => {
    // Now async for API call
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue(""); // Clear input after sending
    setIsLoading(true);

    // Call FAQ API
    try {
      const res = await fetch(
        "https://construct-kvv-bn-fork.onrender.com/api/v1/faqs/ask",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: newMessage.content }),
        }
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content:
          data.answer || "Sorry, I couldn't find an answer to your question.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      // Optionally, handle data.relevantFAQs here
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        content:
          "Sorry, there was a problem reaching the assistant. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    handleQuickAction,
    handleSendMessage,
    isLoading,
  };
}
