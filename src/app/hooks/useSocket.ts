import { useEffect, useState } from 'react';
import io from "socket.io-client";
import { getUserDataFromLocalStorage } from '../utils/middlewares/UserCredentions';

// Type definitions
interface NotificationPayload {
  title?: string;
  message: string;
  toUserId?: string;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export const useSocket = () => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken'); 

    if (token) {
      // Your backend doesn't use token for authentication during handshake
      // It uses the register event after connection
      const socketInstance = io(SOCKET_URL, {
        transports: ['websocket', 'polling']
      });

      socketInstance.on('connect', () => {
        console.log('Connected to notification server!', socketInstance.id);
        setIsConnected(true);

        // --- REGISTER USER ---
        const user = getUserDataFromLocalStorage();
        if (user && user.id) {
          socketInstance.emit('register', user.id);
          console.log(`Socket attempting to register user: ${user.id}`);
        }
        // --- END REGISTRATION ---
      });

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from notification server!');
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (error: Error) => {
        console.error('Socket connection failed:', error);
        setIsConnected(false);
      });

      // Listen for notifications
      socketInstance.on('newNotification', (notification: { title?: string; message: string }) => {
        console.log('📨 New notification received:', notification);
        // Handle the notification (e.g., show toast, update state, etc.)
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, []);

  // Helper function to send notifications
  const sendNotification = (notification: NotificationPayload) => {
    if (socket && isConnected) {
      socket.emit('sendNotification', notification);
    }
  };

  return { socket, isConnected, sendNotification };
};