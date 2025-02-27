"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  MessageSquare,
  PlusCircle,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface ChatHistoryProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user: any; // Replace 'any' with your user type
  onLogout: () => Promise<void>;
}

// Placeholder data for chat history
const placeholderChats = [
  { id: "1", title: "Physics Chat" },
  { id: "2", title: "Math Problems" },
  { id: "3", title: "General Q&A" },
  { id: "4", title: "History Notes" },
  { id: "5", title: "Coding Help" },
];

export function ChatHistory({
  isCollapsed,
  onToggleCollapse,
  user,
  onLogout,
}: ChatHistoryProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  return (
    <aside
      className={`bg-gray-100 shadow-lg ${
        isCollapsed ? "w-16" : "w-72"
      } transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-800">CHAT A.I.+</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="ml-auto shrink-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="p-4">
            <Button
              variant="default"
              className="w-full justify-start gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            >
              <PlusCircle className="h-4 w-4" />
              New chat
            </Button>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">
                Your conversations
              </h3>
              <ul className="mt-2 space-y-2">
                {placeholderChats.map((chat) => (
                  <li
                    key={chat.id}
                    className={`flex items-center justify-between rounded-lg p-2 hover:bg-gray-200 cursor-pointer ${
                      selectedChat === chat.id ? "bg-gray-200" : ""
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="truncate">{chat.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle delete chat (implementation later)
                        console.log("Delete chat:", chat.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <>
          <Separator />
          <div className="p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>
                  {user?.email?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user.email}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
