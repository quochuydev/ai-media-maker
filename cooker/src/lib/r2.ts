import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { config } from "@/lib/config";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${config.r2.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.r2.accessKeyId,
    secretAccessKey: config.r2.secretAccessKey,
  },
});

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string = "image/png"
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: config.r2.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return `${config.r2.publicUrl}/${key}`;
}
