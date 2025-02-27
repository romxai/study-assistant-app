"use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { useAuth } from "../context/AuthContext";
    import { Chat } from "@/components/chat/Chat";
    import { Sidebar } from "@/components/Sidebar";

    export default function DashboardPage() {
      const { user } = useAuth();
      const router = useRouter();
      const [messages, setMessages] = useState([]);

      const handleNewChat = () => {
        setMessages([]); // Clear messages for a new chat
      };

      if (!user) {
        return null;
      }

      return (
        <div className="flex h-screen bg-white">
          <Sidebar onNewChat={handleNewChat} />
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <Chat messages={messages} setMessages={setMessages} />
            </div>
          </main>
        </div>
      );
    }
