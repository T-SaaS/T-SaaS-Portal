/**
 * Generates a URL-friendly slug from a company name
 * @param companyName - The company name to convert
 * @returns A URL-friendly slug
 */
export function generateCompanySlug(companyName: string): string {
  return (
    companyName
      .toLowerCase()
      .trim()
      // Replace special characters and spaces with hyphens
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      // Remove multiple consecutive hyphens
      .replace(/-+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}

/**
 * Generates a hash-based slug for better uniqueness
 * @param companyName - The company name to convert
 * @returns A hash-based slug
 */
export function generateCompanyHash(companyName: string): string {
  const baseSlug = generateCompanySlug(companyName);

  // Simple hash function for additional uniqueness
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    const char = companyName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert to positive hex string and take first 6 characters
  const hashHex = Math.abs(hash).toString(16).substring(0, 6);

  return `${baseSlug}-${hashHex}`;
}

/**
 * Validates if a slug matches the expected format
 * @param slug - The slug to validate
 * @returns True if valid, false otherwise
 */
export function isValidCompanySlug(slug: string): boolean {
  // Must be lowercase, contain only letters, numbers, and hyphens
  // Must be between 3 and 50 characters
  const slugRegex = /^[a-z0-9-]{3,50}$/;
  return slugRegex.test(slug);
}
