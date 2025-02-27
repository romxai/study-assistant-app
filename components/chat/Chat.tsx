"use client";

    import { useState, useEffect, useRef } from "react";
    import { v4 as uuidv4 } from "uuid";
    import { ChatMessage as ChatMessageType } from "@/types/chat";
    import { ChatMessage } from "./ChatMessage";
    import { ChatInput } from "./ChatInput";
    import { generateResponse } from "@/lib/gemini";
    import { useAuth } from "@/app/context/AuthContext";
    import { ChevronDown } from "lucide-react";
    import { Button } from "@/components/ui/button";

    interface ChatProps {
      messages: ChatMessageType[];
      setMessages: (messages: ChatMessageType[]) => void;
    }

    export function Chat({ messages, setMessages }: ChatProps) {
      const [isLoading, setIsLoading] = useState(false);
      const messagesEndRef = useRef<HTMLDivElement>(null);
      const { user } = useAuth();

      useEffect(() => {
        scrollToBottom();
      }, [messages]);

      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };

      const handleSendMessage = async (
        content: string,
        attachments?: File[]
      ) => {
        if (!user) return;

        try {
          setIsLoading(true);

          // Add user message
          const userMessage: ChatMessageType = {
            id: uuidv4(),
            content,
            role: "user",
            timestamp: Date.now(),
            attachments: attachments?.map((file) => ({
              type: file.type.startsWith("image/") ? "image" : "document",
              url: URL.createObjectURL(file),
              name: file.name,
            })),
          };
          setMessages((prev) => [...prev, userMessage]);

          // Process attachments if any
          let context = "";
          if (attachments?.length) {
            context = `User uploaded: ${attachments
              .map((f) => f.name)
              .join(", ")}`;
          }

          // Generate AI response
          const aiResponse = await generateResponse(content, context);

          const assistantMessage: ChatMessageType = {
            id: uuidv4(),
            content: aiResponse,
            role: "assistant",
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
          console.error("Error sending message:", error);
          const errorMessage: ChatMessageType = {
            id: uuidv4(),
            content:
              "Sorry, there was an error processing your request. Please try again.",
            role: "assistant",
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <div className="flex flex-col h-full">
          {/* Top Bar (Model Selector - Placeholder) */}
            <div className="self-stretch h-20 px-8 py-5 border-b border-slate-300 flex-col justify-start items-start gap-2.5 flex overflow-hidden">
                <div className="self-stretch justify-start items-center gap-4 inline-flex">
                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                        <div className="justify-center items-center gap-2 inline-flex overflow-hidden">
                            <div className="text-slate-600 text-lg font-bold font-['Plus Jakarta Sans'] leading-normal">sloth GPT 7.0</div>
                            <ChevronDown className="h-5 w-5 text-slate-500" />
                        </div>
                    </div>
                </div>
            </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t p-4 bg-white">
            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      );
    }
