"use client";

import { useNotifications } from "../hooks/useNotifications";

/**
 * This component's sole purpose is to initialize the notification listener hook.
 * It renders nothing and is designed to be placed inside a layout that has
 * access to all the necessary context providers.
 */
export const NotificationInitializer = () => {
  useNotifications();
  return null;
}; 