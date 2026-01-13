import { AWS_S3_ENABLED } from "../config/config";
import { uploadToS3, deleteFromS3, getS3Url } from "./s3.client";

export async function uploadImage(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<string> {
  if (!AWS_S3_ENABLED) {
    throw new Error("Image upload is not configured");
  }

  return await uploadToS3(buffer, fileName, mimeType);
}

export async function deleteImage(fileName: string): Promise<void> {
  if (!AWS_S3_ENABLED) {
    console.log("S3 is not enabled, skipping image deletion");
    return;
  }

  try {
    await deleteFromS3(fileName);
  } catch (error) {
    console.error(`Failed to delete image: ${fileName}`, error);
  }
}

export async function getImageUrl(fileName: string): Promise<string> {
  if (!AWS_S3_ENABLED) {
    throw new Error("Image service is not configured");
  }

  return await getS3Url(fileName);
}

export async function deleteImages(fileNames: string[]): Promise<void> {
  if (!AWS_S3_ENABLED) {
    console.log("S3 is not enabled, skipping image deletion");
    return;
  }

  const deletePromises = fileNames.map((fileName) =>
    deleteImage(fileName).catch((error) => {
      console.error(`Failed to delete ${fileName}:`, error);
    }),
  );

  await Promise.all(deletePromises);
}
