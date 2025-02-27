"use client";

import { useState } from "react";
import { ChatInput } from "./ChatInput";
import { generateResponse } from "@/lib/gemini";
import { ChatMessage } from "./ChatMessage";
import { ChatMessage as ChatMessageType, MessageRole } from "@/types/chat";

type Message = ChatMessageType;

interface ChatProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export function Chat({ messages, setMessages }: ChatProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (
    content: string,
    attachments?: { type: "document" | "image"; url: string; name: string }[]
  ) => {
    try {
      setIsLoading(true);

      // Create and add user message
      const userMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "user",
        content: content || "Attached file for analysis",
        timestamp: Date.now(),
        attachments: attachments,
      };

      // Add user message to chat
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Get AI response
      const response = await generateResponse(
        content,
        messages,
        attachments?.[0] // Currently handling one file at a time
      );

      // Add AI response
      const aiMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };
      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6 px-24">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome to CHAT A.I.+
              </h1>
              <p className="text-gray-600 max-w-md">
                Ask me anything! I'm here to help you with your questions and
                tasks.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
