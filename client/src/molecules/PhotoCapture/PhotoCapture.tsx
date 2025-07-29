import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useDropzone } from "react-dropzone";
import { Button } from "@/atoms/Button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Camera,
  Upload,
  X,
  RotateCcw,
  Download,
  FileImage,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PhotoCaptureProps {
  value?: string | null; // Base64 image data or file URL
  onChange: (value: string | null) => void;
  label: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  error?: string;
}

export function PhotoCapture({
  value,
  onChange,
  label,
  required = false,
  className,
  disabled = false,
  error,
}: PhotoCaptureProps) {
  const [mode, setMode] = useState<"idle" | "camera" | "upload">("idle");
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setCapturedImage(result);
          onChange(result);
          setMode("idle");
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    disabled: disabled || mode !== "upload",
  });

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        onChange(imageSrc);
        setMode("idle");
      }
    }
  }, [onChange]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    onChange(null);
    setMode("idle");
  }, [onChange]);

  const downloadImage = useCallback(() => {
    if (value) {
      const link = document.createElement("a");
      link.href = value;
      link.download = `${label
        .toLowerCase()
        .replace(/\s+/g, "-")}-${Date.now()}.png`;
      link.click();
    }
  }, [value, label]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment", // Use back camera on mobile
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={downloadImage}
            disabled={disabled}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        )}
      </div>

      {/* Display captured/uploaded image */}
      {value && mode === "idle" && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={value}
                alt={label}
                className="w-full h-48 object-contain rounded-md border"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={retakePhoto}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onChange(null)}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera mode */}
      {mode === "camera" && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMode("idle")}
                  disabled={disabled}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={capturePhoto}
                  disabled={disabled}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload mode */}
      {mode === "upload" && (
        <Card>
          <CardContent className="p-4">
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-300 hover:border-slate-400",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
              {isDragActive ? (
                <p className="text-sm text-blue-600">Drop the image here...</p>
              ) : (
                <div>
                  <p className="text-sm text-slate-600">
                    Drag & drop an image here, or click to select
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports: JPEG, PNG, WebP
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("idle")}
                disabled={disabled}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action buttons when no image */}
      {!value && mode === "idle" && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setMode("camera")}
            disabled={disabled}
          >
            <Camera className="h-4 w-4 mr-2" />
            Take Photo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setMode("upload")}
            disabled={disabled}
          >
            <FileImage className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
