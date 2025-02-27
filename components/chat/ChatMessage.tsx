import { ChatMessage as ChatMessageType } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileIcon } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex gap-3">
      <Avatar className="h-12 w-12 shrink-0">
        {message.role === "user" ? (
          <>
            <AvatarImage src="" />
            <AvatarFallback className="bg-gray-200">
              <img src="/user-avatar.png" alt="User" className="rounded-full" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="" />
            <AvatarFallback className="bg-indigo-50">
              <svg
                width="24"
                height="24"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" rx="24" fill="#EEF2FF" />
                <path
                  d="M27.0625 19.625H20.9375C20.5894 19.625 20.2556 19.7633 20.0094 20.0094C19.7633 20.2556 19.625 20.5894 19.625 20.9375V27.0625C19.625 27.4106 19.7633 27.7444 20.0094 27.9906C20.2556 28.2367 20.5894 28.375 20.9375 28.375H27.0625C27.4106 28.375 27.7444 28.2367 27.9906 27.9906C28.2367 27.7444 28.375 27.4106 28.375 27.0625V20.9375C28.375 20.5894 28.2367 20.2556 27.9906 20.0094C27.7444 19.7633 27.4106 19.625 27.0625 19.625Z"
                  fill="#4F46E5"
                />
              </svg>
            </AvatarFallback>
          </>
        )}
      </Avatar>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-800 text-base font-bold font-['Plus Jakarta Sans'] leading-snug">
              {message.role === "user" ? "You" : "CHAT A.I.+"}
            </span>
          </div>
          <span className="text-slate-400 text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
            {formattedTime}
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded-3xl">
          <p className="text-slate-600 text-base font-normal font-['Plus Jakarta Sans'] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          {message.attachments?.map((attachment, index) => (
            <div key={index} className="mt-3">
              {attachment.type === "image" ? (
                <div className="relative rounded-3xl overflow-hidden border border-slate-200">
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-full h-auto max-h-[260px] object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                  <FileIcon className="h-4 w-4 text-slate-500" />
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {attachment.name}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
