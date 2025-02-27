"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Chat } from "@/components/chat/Chat";
import { ChatHistory } from "@/components/chat/ChatHistory";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("");
  const [isTemporaryChat, setIsTemporaryChat] = useState(true);

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleNewChat = () => {
    setSelectedConversationId("");
    setIsTemporaryChat(true);
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsTemporaryChat(conversationId === "");
  };

  const handleConversationCreated = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsTemporaryChat(false);
  }, []);

  return (
    <div className="flex h-screen bg-white">
      <ChatHistory
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        user={user}
        onLogout={async () => {
          try {
            await logout();
            router.push("/login");
          } catch (error) {
            console.error("Logout failed:", error);
          }
        }}
        onSelectConversation={handleSelectConversation}
        selectedConversationId={selectedConversationId}
        isTemporaryChat={isTemporaryChat}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Chat
          conversationId={selectedConversationId || undefined}
          onNewChat={handleNewChat}
          onConversationCreated={handleConversationCreated}
        />
      </main>
    </div>
  );
}
