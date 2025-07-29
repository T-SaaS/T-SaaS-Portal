import type { SignatureData } from "@shared/schema";
import { supabase } from "../db";

/**
 * Retrieves a signature image from storage for editing purposes
 * @param signatureData - The signature metadata from the database
 * @returns Promise<string> - Base64 data URL of the signature image
 */
export async function getSignatureForEditing(
  signatureData: SignatureData
): Promise<string | null> {
  if (!signatureData?.path || !signatureData.uploaded) {
    return null;
  }

  try {
    // Get a fresh signed URL for the signature
    const { data: signedUrlData, error } = await supabase.storage
      .from("application-signatures")
      .createSignedUrl(signatureData.path, 60 * 60); // 1 hour

    if (error || !signedUrlData?.signedUrl) {
      console.error("Error getting signed URL for signature:", error);
      return null;
    }

    // Fetch the image from the signed URL
    const response = await fetch(signedUrlData.signedUrl);
    if (!response.ok) {
      console.error("Error fetching signature image:", response.statusText);
      return null;
    }

    // Convert to base64 data URL
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const dataUrl = `data:${blob.type};base64,${base64}`;

    return dataUrl;
  } catch (error) {
    console.error("Error retrieving signature for editing:", error);
    return null;
  }
}

/**
 * Retrieves multiple signatures for editing
 * @param signatures - Object containing signature data for different types
 * @returns Promise<Record<string, string | null>> - Object with signature types as keys and base64 data as values
 */
export async function getSignaturesForEditing(signatures: {
  background_check_consent_signature?: SignatureData;
  employment_consent_signature?: SignatureData;
  drug_test_consent_signature?: SignatureData;
  motor_vehicle_record_consent_signature?: SignatureData;
  general_consent_signature?: SignatureData;
}): Promise<Record<string, string | null>> {
  const results: Record<string, string | null> = {};

  const signatureTypes = [
    "background_check_consent_signature",
    "employment_consent_signature",
    "drug_test_consent_signature",
    "motor_vehicle_record_consent_signature",
    "general_consent_signature",
  ] as const;

  // Process signatures in parallel
  const promises = signatureTypes.map(async (type) => {
    const signatureData = signatures[type];
    if (signatureData) {
      const dataUrl = await getSignatureForEditing(signatureData);
      return { type, dataUrl };
    }
    return { type, dataUrl: null };
  });

  const resolvedSignatures = await Promise.all(promises);

  resolvedSignatures.forEach(({ type, dataUrl }) => {
    results[type] = dataUrl;
  });

  return results;
}

/**
 * Validates if a signature can be edited (has valid storage data)
 * @param signatureData - The signature metadata from the database
 * @returns boolean - Whether the signature can be edited
 */
export function canEditSignature(signatureData?: SignatureData): boolean {
  return !!(signatureData?.uploaded && signatureData?.path);
}
