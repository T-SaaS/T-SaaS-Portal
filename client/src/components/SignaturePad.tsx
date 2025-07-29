import React, { useRef, useEffect, useState, useCallback } from "react";
import SignaturePad from "signature_pad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SignaturePadProps {
  onSignatureChange: (signatureData: string | null) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showClearButton?: boolean;
  showCard?: boolean;
  initialSignatureData?: string | null;
}

export const SignaturePadComponent: React.FC<SignaturePadProps> = ({
  onSignatureChange,
  required = false,
  disabled = false,
  className = "",
  showClearButton = true,
  showCard = true,
  initialSignatureData = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize signature pad
  useEffect(() => {
    if (canvasRef.current && !signaturePadRef.current) {
      const canvas = canvasRef.current;
      const signaturePad = new SignaturePad(canvas, {
        backgroundColor: "rgb(255, 255, 255)",
        penColor: "rgb(0, 0, 0)",
        minWidth: 1,
        maxWidth: 2.5,
      });

      signaturePadRef.current = signaturePad;

      // Handle window resize
      const handleResize = () => {
        const canvas = canvasRef.current;
        if (canvas && signaturePadRef.current) {
          const ratio = Math.max(window.devicePixelRatio || 1, 1);
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext("2d")?.scale(ratio, ratio);
          signaturePadRef.current.clear();
        }
      };

      window.addEventListener("resize", handleResize);
      handleResize(); // Initial resize

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // Restore initial signature data
  useEffect(() => {
    if (signaturePadRef.current && initialSignatureData) {
      signaturePadRef.current.fromDataURL(initialSignatureData);
      setHasSignature(true);
    }
  }, [initialSignatureData]);

  // Handle signature changes using SignaturePad's built-in events
  useEffect(() => {
    const signaturePad = signaturePadRef.current;
    if (signaturePad) {
      const handleBeginStroke = () => {
        // Signature started
      };

      const handleEndStroke = () => {
        const isEmpty = signaturePad.isEmpty();
        setHasSignature(!isEmpty);

        if (!isEmpty) {
          const signatureData = signaturePad.toDataURL();
          onSignatureChange(signatureData);
        } else {
          onSignatureChange(null);
        }
      };

      signaturePad.addEventListener("beginStroke", handleBeginStroke);
      signaturePad.addEventListener("endStroke", handleEndStroke);

      return () => {
        signaturePad.removeEventListener("beginStroke", handleBeginStroke);
        signaturePad.removeEventListener("endStroke", handleEndStroke);
      };
    }
  }, [onSignatureChange]);

  // Clear signature
  const clearSignature = useCallback(() => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setHasSignature(false);
      onSignatureChange(null);
    }
  }, [onSignatureChange]);

  const canvasElement = (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className={`w-full h-48 border border-gray-300 rounded-md bg-white cursor-crosshair ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        style={{ touchAction: "none" }}
      />
      {!hasSignature && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-gray-400 text-sm italic">Sign here</span>
        </div>
      )}
    </div>
  );

  const clearButton = showClearButton && (
    <div className="flex space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={clearSignature}
        disabled={!hasSignature || disabled}
        size="sm"
      >
        Clear Signature
      </Button>
    </div>
  );

  const requiredMessage = required && !hasSignature && (
    <p className="text-red-500 text-sm">Signature is required</p>
  );

  if (showCard) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Digital Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {canvasElement}
          {clearButton}
          {requiredMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {canvasElement}
      {clearButton}
      {requiredMessage}
    </div>
  );
};
