"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useNegotiation } from "@/app/hooks/useNegotiation";
import { useUserStore } from "@/store/userStore";
import { constructorService } from "@/app/services/constructorService";
import { Paperclip, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NegotiationMessage } from "@/types/negotiation";
import { toast } from "sonner";
import { AcceptBidModal } from "./AcceptBidModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AMBER = "#FFC107";
const WHITE = "#FFFFFF";
// Helper to abbreviate full name to initials, e.g., "John Doe" -> "JD"
function getInitialsFromName(name: string) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${(parts[0][0] || "").toUpperCase()}${(parts[parts.length - 1][0] || "").toUpperCase()}`;
}

const BidDetailsCard = ({
  bid,
}: {
  bid: { amount: number; message?: string; createdAt: string } | null;
}) => {
  if (!bid) return null;

  const formatAmount = (amount: number) => {
    if (isNaN(amount) || amount == null) return "Amount not available";
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date not available";
    return date.toLocaleString();
  };

  return (
    <Card className="mb-4 border-blue-200">
      <CardHeader>
        <CardTitle>Initial Bid Details</CardTitle>
        <CardDescription>
          This is the starting point of your negotiation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-2">{formatAmount(bid.amount)}</p>
        {bid.message && <p className="text-gray-700 mb-2">{bid.message}</p>}
        <p className="text-xs text-gray-500 mt-2">
          Bid placed on: {formatDate(bid.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
};

const MessageBubble = ({
  msg,
  isOwnMessage,
  profilePic,
  displayName = "",
  isSeller,
}: {
  msg: NegotiationMessage;
  isOwnMessage: boolean;
  profilePic?: string;
  displayName?: string;
  isSeller: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const maxPreviewLength = 200;
  const isLong = msg.message.length > maxPreviewLength;
  const displayMessage =
    expanded || !isLong
      ? msg.message
      : msg.message.slice(0, maxPreviewLength) + "...";

  // Amber for contractor, white for user
  const bubbleBg = isSeller
    ? `bg-[${AMBER}] text-black`
    : `bg-[${WHITE}] text-black border border-gray-200`;
  const align = isOwnMessage ? "justify-end" : "justify-start";
  const avatarOrder = isOwnMessage ? "order-2 ml-2" : "order-1 mr-2";
  const bubbleOrder = isOwnMessage ? "order-1" : "order-2";

  const displayNameSafe = displayName || "";

  return (
    <div className={`flex ${align} w-full items-end`}>
      <div className={avatarOrder}>
        <Avatar className="size-10 shadow-md border-2 border-white">
          {profilePic ? (
            <AvatarImage src={profilePic} alt={displayNameSafe} />
          ) : (
            <AvatarFallback
              style={{
                background: isSeller ? AMBER : WHITE,
                color: isSeller ? "black" : "black",
                border: isSeller ? "2px solid #FFC107" : "2px solid #eee",
              }}
            >
              {getInitialsFromName(displayNameSafe)}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
      <div
        className={`${bubbleOrder} relative max-w-[70%] p-4 rounded-2xl shadow-md ${bubbleBg} transition-all`}
        style={{ wordBreak: "break-word" }}
      >
        <p className="font-medium text-base leading-relaxed">
          {displayMessage}
        </p>
        {isLong && (
          <button
            className="text-xs underline mt-1 text-amber-700 hover:text-amber-900 focus:outline-none"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
        {msg.fileUrl && (
          <a
            href={msg.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline mt-2 block text-amber-700 hover:text-amber-900"
          >
            View Attachment
          </a>
        )}
        <p className="text-xs opacity-60 mt-2 text-right">
          {new Date(msg.createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

const InitialBidMessage = ({
  bid,
  userId,
  profilePic,
  displayName = "",
}: {
  bid: {
    message?: string;
    amount: number;
    sellerId?: string;
    createdAt?: string;
  };
  userId: string | null;
  profilePic?: string;
  displayName?: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const maxPreviewLength = 200;
  const isLong = bid.message && bid.message.length > maxPreviewLength;
  const displayMessage =
    expanded || !isLong
      ? bid.message
      : bid.message?.slice(0, maxPreviewLength) + "...";
  // Assume initial bid is always from seller, so align right for seller
  const isOwnMessage = bid.sellerId === userId;

  const formatAmount = (amount: number) => {
    if (isNaN(amount) || amount == null) return "Amount not available";
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString();
  };

  const displayNameSafe = displayName || "";

  return (
    <div
      className={`flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      } mb-4 w-full items-end`}
    >
      <div className={`${isOwnMessage ? "order-2 ml-2" : "order-1 mr-2"}`}>
        <Avatar className="size-10 shadow-md border-2 border-white">
          {profilePic ? (
            <AvatarImage src={profilePic} alt={displayNameSafe} />
          ) : (
            <AvatarFallback
              style={{
                background: AMBER,
                color: "black",
                border: "2px solid #FFC107",
              }}
            >
              {getInitialsFromName(displayNameSafe)}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
      <div
        className={`${
          isOwnMessage ? "order-1" : "order-2"
        } max-w-[70%] p-4 rounded-2xl shadow-md bg-[${AMBER}] text-black transition-all`}
        style={{ wordBreak: "break-word" }}
      >
        <div className="mb-2">
          <span className="text-xs font-semibold opacity-75">Initial Bid</span>
        </div>
        <p className="font-semibold mb-1">{formatAmount(bid.amount)}</p>
        {displayMessage && <p className="mb-1">{displayMessage}</p>}
        {isLong && (
          <button
            className="text-xs underline mt-1 text-amber-700 hover:text-amber-900 focus:outline-none"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
        <p className="text-xs opacity-60 mt-2 text-right">
          {formatTime(bid.createdAt || "")}
        </p>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <span className="ml-2">Loading chat...</span>
  </div>
);

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="text-red-500 mb-4">
        <p className="font-semibold">Something went wrong</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Helper to get initials from businessName
function getBusinessInitials(businessName: string) {
  if (!businessName) return "";
  const parts = businessName.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Helper to get user info from localStorage
function getLocalUser() {
  if (typeof window !== "undefined") {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) return JSON.parse(userStr);
    } catch {}
  }
  return null;
}

interface ChatContentProps {
  bidId: string;
  initialBidData?: {
    id: string;
    message: string;
    amount: number;
    createdAt: string;
    sellerId?: string;
  };
  initialMessages?: NegotiationMessage[];
}

const ChatContent = ({
  bidId,
  initialBidData,
  initialMessages,
}: ChatContentProps) => {
  const {
    historyQuery,
    sendMessage,
    isSending,
    isClient: isNegotiationClient,
  } = useNegotiation(bidId, initialMessages);
  const {
    data: messages,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = historyQuery;

  const { role: userRole, email, isHydrated } = useUserStore();

  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractorName, setContractorName] = useState<string>("");
  const [contractorPic, setContractorPic] = useState<string | undefined>(undefined);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const allMessages = React.useMemo(() => {
    if (!initialBidData || !messages) return [];
    const initialBidMessage = {
      id: `initial-bid-${initialBidData.id}`,
      bidId: initialBidData.id,
      senderId: initialBidData.sellerId || "",
      senderType: "CONTRACTOR" as const,
      message: initialBidData.message,
      createdAt: initialBidData.createdAt,
      isInitialBid: true as const,
      amount: initialBidData.amount,
      sellerId: initialBidData.sellerId,
    };
    return [initialBidMessage, ...messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [initialBidData, messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [allMessages]);

  // Sender roles
  const isContractor = userRole === "CONTRACTOR";
  const isCustomer = userRole === "CUSTOMER";

  // Load current contractor profile for avatar/alt
  useEffect(() => {
    async function loadProfile() {
      if (!isContractor) return;
      try {
        const res = await constructorService.getCurrentProfile();
        const user = res?.data?.user;
        if (user) {
          const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
          setContractorName(name || "Contractor");
          if (user.profilePic) setContractorPic(user.profilePic);
        }
      } catch {
        // ignore
      }
    }
    loadProfile();
  }, [isContractor]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return;
    if (!isHydrated || (!isContractor && !isCustomer)) {
      toast.error("You must be a Contractor or a Customer to send messages.");
      return;
    }

    try {
      await sendMessage({
        bidId,
        message: newMessage,
        senderType: isContractor ? "CONTRACTOR" : "USER",
        file: file || undefined,
      });
      setNewMessage("");
      setFile(null);
    } catch {
      toast.error("Failed to send message.");
    }
    console.log("handleSendMessage called", {
      userRole,
      email,
      isHydrated,
      newMessage,
    });
  };

  if (!isNegotiationClient) {
    return <LoadingSpinner />;
  }

  const isLoading = isLoadingMessages;
  const error = messagesError;

  // Debug: log bid details
  console.log("bidDetails:", initialBidData);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorFallback
        error={error}
        resetErrorBoundary={() => window.location.reload()}
      />
    );

  // Wait for user store hydration before rendering chat input
  if (!isHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <AcceptBidModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div
        className="flex flex-col border rounded-lg"
        style={{ height: "70vh", maxHeight: "70vh" }}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Negotiation Chat</h2>
          {/* {isSeller && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              disabled={!initialBidData}
            >
              Accept Bid
            </button>
          )} */}
        </div>
        <ScrollArea
          className="flex-grow p-4"
          ref={scrollAreaRef}
          style={{ maxHeight: "calc(70vh - 64px)", minHeight: 0 }}
        >
          <BidDetailsCard bid={initialBidData ?? null} />
          <div className="space-y-6">
            {allMessages?.map((msg) => {
              // Determine if this is a contractor or user message
              const isSellerMsg = msg.senderType === "CONTRACTOR";
              const isOwnMessage = isSellerMsg
                ? userRole === "CONTRACTOR"
                : userRole !== "CONTRACTOR";
              let displayName = "";
              let profilePic = undefined as string | undefined;
              if (isSellerMsg) {
                if (
                  "bid" in msg &&
                  typeof msg.bid === "object" &&
                  msg.bid !== null &&
                  "seller" in msg.bid &&
                  typeof msg.bid.seller === "object" &&
                  msg.bid.seller !== null
                ) {
                  const seller = msg.bid.seller as {
                    businessName?: string;
                    user?: {
                      profilePic?: string;
                      firstName?: string;
                      lastName?: string;
                    };
                  };
                  profilePic = seller.user?.profilePic || contractorPic;
                  if (profilePic) {
                    displayName = `${seller.user?.firstName ?? contractorName.split(" ")[0] ?? ""} ${
                      seller.user?.lastName ?? contractorName.split(" ")[1] ?? ""
                    }`.trim();
                  } else if (seller.user?.firstName && seller.user?.lastName) {
                    displayName = `${seller.user.firstName[0].toUpperCase()}${seller.user.lastName[0].toUpperCase()}`;
                  } else if (seller.businessName) {
                    displayName = getBusinessInitials(seller.businessName);
                  } else {
                    displayName = contractorName ? contractorName : "C";
                  }
                } else {
                  displayName = contractorName || "Contractor";
                  profilePic = contractorPic || undefined;
                }
              } else {
                // User info from localStorage
                const localUser = getLocalUser();
                if (localUser) {
                  // If user has profilePic, use full name. Otherwise, use initials (first letter of first and last name)
                  if (localUser.profilePic) {
                    displayName = `${localUser.firstName} ${localUser.lastName}`;
                    profilePic = localUser.profilePic;
                  } else {
                    const initials = `${(
                      localUser.firstName?.[0] || ""
                    ).toUpperCase()}${(
                      localUser.lastName?.[0] || ""
                    ).toUpperCase()}`;
                    displayName = initials;
                    profilePic = undefined;
                  }
                } else {
                  displayName = "User";
                }
              }
              if ("isInitialBid" in msg && msg.isInitialBid) {
                return (
                  <InitialBidMessage
                    key={msg.id}
                    bid={msg ?? { amount: 0, createdAt: "" }}
                    userId={email || ""}
                    profilePic={profilePic}
                    displayName={displayName || ""}
                  />
                );
              } else {
                return (
                  <MessageBubble
                    key={msg.id}
                    msg={msg as NegotiationMessage}
                    isOwnMessage={isOwnMessage}
                    profilePic={profilePic}
                    displayName={displayName}
                    isSeller={isSellerMsg}
                  />
                );
              }
            })}
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex items-center gap-2 bg-white">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSendMessage()
            }
            placeholder="Type your message..."
            disabled={isSending}
            className="flex-1 rounded-full border-2 border-amber-300 focus:border-amber-500 px-4 py-2 shadow-sm bg-white text-black"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer p-2 rounded-full hover:bg-amber-100 border border-amber-200"
          >
            <Paperclip className="text-amber-600" />
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            disabled={isSending}
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || (!newMessage.trim() && !file)}
            className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 shadow-md"
          >
            <Send />
          </button>
        </div>
        {file && (
          <div className="p-2 bg-gray-50 border-t">
            <p className="text-sm">Selected file: {file.name}</p>
            <button
              onClick={() => setFile(null)}
              className="text-xs text-red-500 hover:text-red-700 ml-2"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </>
  );
};

interface NegotiationChatProps {
  bidId: string;
  initialBidData?: ChatContentProps["initialBidData"];
  initialMessages?: ChatContentProps["initialMessages"];
}

export const NegotiationChat = ({
  bidId,
  initialBidData,
  initialMessages,
}: NegotiationChatProps) => {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <ChatContent
          bidId={bidId}
          initialBidData={initialBidData}
          initialMessages={initialMessages}
        />
      </Suspense>
    </>
  );
};
