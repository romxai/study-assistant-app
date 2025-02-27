"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./FileUpload";
import { PaperclipIcon, SendIcon } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { processFile } from "@/lib/gemini";

interface ChatInputProps {
  onSend: (content: string, attachments?: File[]) => Promise<void>;
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

      // If there are attachments, process them first
      if (attachments.length > 0) {
        for (const file of attachments) {
          // Upload to Cloudinary
          const cloudinaryUrl = await uploadToCloudinary(file);

          // Process file with Gemini
          const analysis = await processFile(file, message || undefined);

          // Send the analysis
          await onSend(analysis);
        }
      } else {
        // Just send the text message
        await onSend(message);
      }

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {showFileUpload && (
        <FileUpload
          onUpload={handleFileUpload}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        />
      )}
      <div className="flex items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowFileUpload(!showFileUpload)}
          className="text-gray-500 hover:text-gray-700"
        >
          <PaperclipIcon className="h-5 w-5" />
        </Button>
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message slothGPT..."
          className="min-h-[40px] flex-1 rounded-3xl border-slate-300"
        />
        <Button
          type="submit"
          disabled={isLoading || isProcessing}
          className="bg-indigo-600 text-white rounded-full px-4 py-2 hover:bg-indigo-700"
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs"
            >
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() =>
                  setAttachments((prev) => prev.filter((_, i) => i !== index))
                }
                className="text-destructive hover:text-destructive/90"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="self-stretch text-center text-slate-400 text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
        slothGPT can make mistakes. Check our Terms &amp; Conditions.
      </div>
    </form>
  );
}
