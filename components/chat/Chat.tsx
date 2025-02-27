"use client";

import { useState } from "react";
import { ChatInput } from "./ChatInput";
import { generateResponse } from "@/lib/gemini";

interface Message {
  role: "user" | "model";
  parts: string;
}

interface ChatProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export function Chat({ messages, setMessages }: ChatProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    try {
      setIsLoading(true);

      // Add user message to chat
      const userMessage: Message = { role: "user", parts: content };
      setMessages([...messages, userMessage]);

      // Get AI response
      const response = await generateResponse(content, messages);

      // Add AI response to chat
      const aiMessage: Message = { role: "model", parts: response };
      setMessages([...messages, userMessage, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.parts}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
