"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./FileUpload";
import { PaperclipIcon, SendIcon } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface MessageAttachment {
  type: "document" | "image";
  url: string;
  name: string;
}

interface ChatInputProps {
  onSend: (content: string, attachments?: MessageAttachment[]) => Promise<void>;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (!message.trim() && attachments.length === 0) ||
      isLoading ||
      isProcessing
    )
      return;

    try {
      setIsProcessing(true);
      const processedAttachments: MessageAttachment[] = [];

      for (const file of attachments) {
        const cloudinaryUrl = await uploadToCloudinary(file);

        processedAttachments.push({
          url: cloudinaryUrl,
          type: file.type.startsWith("image/") ? "image" : "document",
          name: file.name,
        });
      }

      await onSend(
        message || "Attached file for analysis",
        processedAttachments
      );
      setMessage("");
      setAttachments([]);
      setShowFileUpload(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setAttachments((prev) => [...prev, file]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      <form onSubmit={handleSubmit} className="space-y-4">
        {showFileUpload && (
          <FileUpload
            onUpload={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
        )}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowFileUpload(!showFileUpload)}
            className="text-gray-400 hover:text-gray-600"
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's in your mind?"
              className="min-h-[44px] max-h-[200px] py-3 px-4 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              rows={1}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center"
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
