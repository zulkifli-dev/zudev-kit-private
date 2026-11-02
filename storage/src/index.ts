import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";

export type StorageConfig = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicBaseUrl: string;
};

export type StorageEnvironment = Partial<Record<
  | "R2_ACCOUNT_ID"
  | "R2_ACCESS_KEY_ID"
  | "R2_SECRET_ACCESS_KEY"
  | "R2_BUCKET_NAME"
  | "R2_PUBLIC_BASE_URL",
  string
>>;

export type UploadObjectInput = {
  key: string;
  body: Uint8Array;
  contentType: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
};

export type StorageClient = Pick<S3Client, "send">;

const requiredEnvironment = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_BASE_URL",
] as const;

export function loadStorageConfig(
  environment: StorageEnvironment = (globalThis as typeof globalThis & {
    process?: { env?: StorageEnvironment };
  }).process?.env ?? {},
): StorageConfig {
  const missing = requiredEnvironment.filter((name) => !environment[name]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required R2 configuration: ${missing.join(", ")}`);
  }

  const accountId = environment.R2_ACCOUNT_ID!.trim();
  const bucketName = environment.R2_BUCKET_NAME!.trim();
  const publicBaseUrl = environment.R2_PUBLIC_BASE_URL!.trim();

  if (!/^[a-f0-9]{32}$/i.test(accountId)) {
    throw new Error("R2_ACCOUNT_ID must be a 32-character Cloudflare account ID.");
  }
  if (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/i.test(bucketName)) {
    throw new Error("R2_BUCKET_NAME is not a valid bucket name.");
  }

  let parsedPublicUrl: URL;
  try {
    parsedPublicUrl = new URL(publicBaseUrl);
  } catch {
    throw new Error("R2_PUBLIC_BASE_URL must be an absolute HTTP(S) URL.");
  }
  if (!(["https:", "http:"].includes(parsedPublicUrl.protocol) && !parsedPublicUrl.username && !parsedPublicUrl.password)) {
    throw new Error("R2_PUBLIC_BASE_URL must use HTTP(S) and must not contain credentials.");
  }
  if (parsedPublicUrl.hostname.toLowerCase().endsWith(".r2.cloudflarestorage.com")) {
    throw new Error(
      "R2_PUBLIC_BASE_URL must be an R2 public bucket URL or custom domain, not the S3 API endpoint.",
    );
  }

  return {
    accountId,
    accessKeyId: environment.R2_ACCESS_KEY_ID!.trim(),
    secretAccessKey: environment.R2_SECRET_ACCESS_KEY!.trim(),
    bucketName,
    publicBaseUrl: parsedPublicUrl.toString().replace(/\/$/, ""),
  };
}

export function createStorageClient(config: StorageConfig): S3Client {
  const clientConfig: S3ClientConfig = {
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  };

  return new S3Client(clientConfig);
}

export function createObjectKey(prefix = "media"): string {
  const safePrefix = prefix
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.replace(/[^a-zA-Z0-9_-]/g, ""))
    .filter((segment) => segment && segment !== "." && segment !== "..");

  if (safePrefix.length === 0) {
    throw new Error("Object key prefix must contain a safe path segment.");
  }

  return `${safePrefix.join("/")}/${crypto.randomUUID()}`;
}

function assertSafeObjectKey(key: string): void {
  if (!key || key.startsWith("/") || key.includes("\\") || key.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new Error("Object key must be a non-empty relative key without traversal segments.");
  }
}

export function createStorage(config: StorageConfig, injectedClient?: StorageClient) {
  let client = injectedClient;
  const getClient = () => {
    client ??= createStorageClient(config);
    return client;
  };

  return {
    async uploadObject(input: UploadObjectInput): Promise<void> {
      assertSafeObjectKey(input.key);
      await getClient().send(new PutObjectCommand({
        Bucket: config.bucketName,
        Key: input.key,
        Body: input.body,
        ContentType: input.contentType,
        CacheControl: input.cacheControl,
        Metadata: input.metadata,
      }));
    },

    async deleteObject(key: string): Promise<void> {
      assertSafeObjectKey(key);
      await getClient().send(new DeleteObjectCommand({ Bucket: config.bucketName, Key: key }));
    },

    publicUrl(key: string): string {
      assertSafeObjectKey(key);
      return `${config.publicBaseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;
    },
  };
}
