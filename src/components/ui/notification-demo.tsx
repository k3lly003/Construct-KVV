"use client";

import React from "react";
import { GenericButton } from "@/components/ui/generic-button";

export function NotificationDemo() {
  // Local addNotification for demo purposes
  const addNotification = (notification: {
    title: string;
    description: string;
    type: string;
  }) => {
    // This should be replaced with a real implementation if needed
    alert(
      `${notification.type.toUpperCase()}: ${notification.title} - ${
        notification.description
      }`
    );
  };

  const addTestNotification = (
    type: "info" | "success" | "warning" | "error"
  ) => {
    switch (type) {
      case "info":
        addNotification({
          title: "Information Update",
          description:
            "This is an informational notification for testing purposes.",
          type: "info",
        });
        break;
      case "success":
        addNotification({
          title: "Success!",
          description: "Operation completed successfully. Great job!",
          type: "success",
        });
        break;
      case "warning":
        addNotification({
          title: "Warning",
          description: "Please review your project settings before proceeding.",
          type: "warning",
        });
        break;
      case "error":
        addNotification({
          title: "Error Occurred",
          description:
            "Something went wrong. Please try again or contact support.",
          type: "error",
        });
        break;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-amber-200 rounded-lg shadow-lg p-4">
      <h3 className="text-small font-semibold text-amber-900 mb-3">
        Test Notifications
      </h3>
      <div className="flex flex-wrap gap-2">
        <GenericButton
          size="sm"
          variant="outline"
          onClick={() => addTestNotification("info")}
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
        >
          Info
        </GenericButton>
        <GenericButton
          size="sm"
          variant="outline"
          onClick={() => addTestNotification("success")}
          className="text-green-600 border-green-300 hover:bg-green-50"
        >
          Success
        </GenericButton>
        <GenericButton
          size="sm"
          variant="outline"
          onClick={() => addTestNotification("warning")}
          className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
        >
          Warning
        </GenericButton>
        <GenericButton
          size="sm"
          variant="outline"
          onClick={() => addTestNotification("error")}
          className="text-red-600 border-red-300 hover:bg-red-50"
        >
          Error
        </GenericButton>
      </div>
    </div>
  );
}
