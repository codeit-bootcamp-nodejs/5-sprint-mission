import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  AWS_S3_ENABLED,
  AWS_S3_BUCKET_NAME,
  AWS_S3_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} from "../config/config";

let s3Client: S3Client | null = null;

export function initS3Client(): S3Client {
  if (!AWS_S3_ENABLED) {
    console.log("AWS S3 is disabled");
    return null as any;
  }

  if (s3Client) {
    return s3Client;
  }

  s3Client = new S3Client({
    region: AWS_S3_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  console.log(`AWS S3 client initialized for bucket: ${AWS_S3_BUCKET_NAME}`);
  return s3Client;
}

export function getS3Client(): S3Client | null {
  if (!AWS_S3_ENABLED) {
    return null;
  }

  if (!s3Client) {
    return initS3Client();
  }

  return s3Client;
}

export async function uploadToS3(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const client = getS3Client();

  if (!client) {
    throw new Error("AWS S3 is not enabled or not configured");
  }

  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `images/${fileName}`,
    Body: buffer,
    ContentType: mimeType,
  });

  try {
    await client.send(command);
    const url = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/images/${fileName}`;
    return url;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload image to S3");
  }
}

export async function deleteFromS3(fileName: string): Promise<void> {
  const client = getS3Client();

  if (!client) {
    throw new Error("AWS S3 is not enabled or not configured");
  }

  const key = fileName.includes("images/") ? fileName : `images/${fileName}`;

  const command = new DeleteObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
  });

  try {
    await client.send(command);
    console.log(`Deleted from S3: ${key}`);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error("Failed to delete image from S3");
  }
}

export async function getS3Url(fileName: string): Promise<string> {
  const client = getS3Client();

  if (!client) {
    throw new Error("AWS S3 is not enabled or not configured");
  }

  const key = fileName.includes("images/") ? fileName : `images/${fileName}`;

  const command = new GetObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
  });

  try {
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error getting signed URL from S3:", error);
    throw new Error("Failed to get signed URL from S3");
  }
}

//s3 aws 수정
