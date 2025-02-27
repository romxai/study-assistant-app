"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
}

export function FileUpload({
  onUpload,
  accept = ".pdf,.doc,.docx,.txt",
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      await onUpload(file);
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
      console.error("File upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
      />
      {isUploading && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
