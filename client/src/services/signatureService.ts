import type { SignatureData } from "@/types/driverApplicationForm";

export interface SignatureUploadResult {
  success: boolean;
  url?: string;
  signedUrl?: string;
  error?: string;
  path?: string;
}

export class SignatureService {
  /**
   * Upload single signature via server endpoint
   */
  static async uploadSignature(
    signatureData: string,
    applicationId: string,
    companyName: string,
    signatureType: string
  ): Promise<SignatureUploadResult> {
    try {
      const response = await fetch("/api/v1/signatures/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signatureData,
          applicationId,
          companyName,
          signatureType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Upload failed",
        };
      }

      return {
        success: true,
        url: result.data.url,
        signedUrl: result.data.signedUrl,
        path: result.data.path,
      };
    } catch (error) {
      console.error("Signature upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Upload multiple signatures for an application
   */
  static async uploadAllSignatures(
    signatures: Record<string, SignatureData>,
    applicationId: string,
    companyName: string
  ): Promise<Record<string, SignatureUploadResult>> {
    const results: Record<string, SignatureUploadResult> = {};

    for (const [signatureType, signatureData] of Object.entries(signatures)) {
      if (signatureData.data && !signatureData.uploaded) {
        const result = await this.uploadSignature(
          signatureData.data,
          applicationId,
          companyName,
          signatureType
        );
        results[signatureType] = result;
      }
    }

    return results;
  }

  /**
   * Delete signature via server endpoint (if needed)
   */
  static async deleteSignature(
    filePath: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/v1/signatures/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Delete failed",
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Signature delete error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get signed URL via server endpoint (if needed)
   */
  static async getSignedUrl(filePath: string): Promise<string | null> {
    try {
      const response = await fetch("/api/v1/signatures/signed-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }),
      });

      const result = await response.json();

      if (!response.ok) {
        return null;
      }

      return result.data.signedUrl || null;
    } catch (error) {
      console.error("Get signed URL error:", error);
      return null;
    }
  }
}
