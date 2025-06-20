// import { useState } from "react";
// import { Message } from "@/app/utils/dtos/chat.dtos";

// export function useHandleSendMessages() {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       content: "Hi, do you have any questions? I'm happy to help.",
//       isUser: false,
//       timestamp: new Date(),
//     }
//   ]);
//   const [inputValue, setInputValue] = useState('');

//   const handleQuickAction = (action: string) => {
//     const newMessage: Message = {
//       id: Date.now().toString(),
//       content: action,
//       isUser: true,
//       timestamp: new Date(),
//     };
//     setMessages(prev => [...prev, newMessage]);

//     // Simulate assistant response
//     setTimeout(() => {
//       const response: Message = {
//         id: (Date.now() + 1).toString(),
//         content: `I'd be happy to help you ${action.toLowerCase()}. Let me provide you with detailed information about that topic.`,
//         isUser: false,
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, response]);
//     }, 1000);
//   };

//   const handleSendMessage = () => { // Moved sendMessage logic here
//     if (!inputValue.trim()) return;

//     const newMessage: Message = {
//       id: Date.now().toString(),
//       content: inputValue,
//       isUser: true,
//       timestamp: new Date(),
//     };
//     setMessages(prev => [...prev, newMessage]);
//     setInputValue(''); // Clear input after sending

//     // Simulate assistant response
//     setTimeout(() => {
//       const response: Message = {
//         id: (Date.now() + 1).toString(),
//         content: "Thank you for your message. I'm processing your request and will provide you with a detailed response shortly.",
//         isUser: false,
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, response]);
//     }, 1000);
//   };

//   return { messages, setMessages, inputValue, setInputValue, handleQuickAction, handleSendMessage };
// }
