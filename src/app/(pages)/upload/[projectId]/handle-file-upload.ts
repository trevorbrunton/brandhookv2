import { getSignedURL } from "@/app/actions/upload-helper";

export const handleFileUpload = async (file: File, documentTitle: string, documentDate: Date) => {
  try {
    const signedURLResult = await getSignedURL({
      fileSize: file.size,
      fileType: file.type,
      checksum: await computeSHA256(file),
      fileName: file.name,
      documentTitle,
      documentDate: documentDate.toISOString(),
    });

    if (signedURLResult.failure) {
      throw new Error(signedURLResult.failure);
    }

    if (!signedURLResult.success) {
      throw new Error("Failed to get signed URL");
    }
    const { url, uploadedFileName } = signedURLResult.success;
    const uploadResult = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResult.ok) {
      throw new Error("Failed to upload file to the server");
    }

    return uploadedFileName;
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }
};

const computeSHA256 = async (file: File) => {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    await file.slice(0, 1_048_576).arrayBuffer() // Process the first MB for a quick checksum.
  );
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
