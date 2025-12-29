"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Upload, FileText, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  error?: string;
  label: string;
  description?: string;
}

interface FilePreview {
  file: File;
  preview: string;
}

export function FileUpload({
  onFilesChange,
  maxFiles = 5,
  accept = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  },
  error,
  label,
  description,
}: FileUploadProps) {
  const [files, setFiles] = useState<FilePreview[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.slice(0, maxFiles - files.length);
      const newFilePreviews = newFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      const updatedFiles = [...files, ...newFilePreviews];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles.map((f) => f.file));
    },
    [files, maxFiles, onFilesChange]
  );

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles.map((f) => f.file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles,
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-2">
      <label className="text-small font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      {description && (
        <p className="text-small text-muted-foreground">{description}</p>
      )}
      
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed",
          error && "border-destructive"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center">
          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
          <p className="text-small text-muted-foreground">
            {isDragActive
              ? "Drop the files here..."
              : `Drag 'n' drop files here, or click to select files`}
          </p>
          <p className="text-small text-muted-foreground mt-1">
            PDF, JPG, PNG up to 10MB ({maxFiles - files.length} remaining)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((filePreview, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getFileIcon(filePreview.file)}
                  <div>
                    <p className="text-small font-medium">{filePreview.file.name}</p>
                    <p className="text-small text-muted-foreground">
                      {(filePreview.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {error && <p className="text-small text-destructive">{error}</p>}
    </div>
  );
}