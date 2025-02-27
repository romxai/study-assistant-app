import { ChatMessage as ChatMessageType } from "@/types/chat";
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    import { Button } from "@/components/ui/button";
    import { FileIcon } from "lucide-react";


    interface ChatMessageProps {
      message: ChatMessageType;
    }

    export function ChatMessage({ message }: ChatMessageProps) {

      return (
        <div
          className={`flex items-start gap-3 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role !== "user" && (
            <Avatar className="h-12 w-12">
              <AvatarImage src="" />
              <AvatarFallback className="text-lg font-bold">AI</AvatarFallback>
            </Avatar>
          )}
          <div
            className={`rounded-3xl px-4 py-3 max-w-md ${
              message.role === "user"
                ? "bg-slate-50 text-slate-600 ml-auto rounded-br-none"
                : "bg-slate-50 text-slate-800 mr-auto rounded-bl-none"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
                <div className="text-slate-800 text-base font-bold font-['Plus Jakarta Sans'] leading-snug pr-7">
                    {message.role === 'user' ? 'You' : 'slothGPT'}
                </div>
                <div className="text-slate-400 text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
            <p className="text-base font-normal leading-relaxed">{message.content}</p>
            {message.attachments?.map((attachment) => (
              <div key={attachment.url} className="mt-2">
                {attachment.type === "image" ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="max-h-60 rounded-md"
                  />
                ) : (
                  <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
                    <FileIcon className="h-4 w-4 text-gray-500" />
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {attachment.name}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
          {message.role === "user" && (
            <Avatar className="h-12 w-12">
              <AvatarImage src="" />
              <AvatarFallback className="text-lg font-bold">U</AvatarFallback>
            </Avatar>
          )}
        </div>
      );
    }
