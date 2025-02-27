export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: number;
  attachments?: {
    type: "document" | "image";
    url: string;
    name: string;
  }[];
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  title: string;
  createdAt: number;
  updatedAt: number;
}
