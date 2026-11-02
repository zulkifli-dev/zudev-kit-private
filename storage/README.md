# `@zudev/storage`

Adapter server-side untuk Cloudflare R2 melalui AWS SDK for JavaScript v3. Package ini hanya menangani operasi object storage; validasi gambar, metadata database, dan lifecycle penggantian media menjadi tanggung jawab aplikasi pemakai.

## Konfigurasi lokal

Buat token API Cloudflare dengan izin baca/tulis object hanya pada bucket yang dipakai. Isi environment server lokal:

```dotenv
R2_ACCOUNT_ID=0123456789abcdef0123456789abcdef
R2_ACCESS_KEY_ID=access-key-id
R2_SECRET_ACCESS_KEY=secret-access-key
R2_BUCKET_NAME=lafacus-media
R2_PUBLIC_BASE_URL=https://media.example.com
```

Jangan commit file `.env` atau kirim variabel rahasia ke kode browser. `R2_PUBLIC_BASE_URL` adalah domain publik/delivery yang sudah diarahkan ke bucket.

## Pemakaian

```ts
import {
  createObjectKey,
  createStorage,
  loadStorageConfig,
} from "@zudev/storage";

const storage = createStorage(loadStorageConfig());
const key = createObjectKey("products");

await storage.uploadObject({
  key,
  body: imageBytes,
  contentType: "image/webp",
  cacheControl: "public, max-age=31536000, immutable",
});

const imageUrl = storage.publicUrl(key);
await storage.deleteObject(key);
```

`createStorage` menerima klien kompatibel `send` sebagai argumen opsional kedua agar aplikasi dapat memasukkan klien tiruan saat pemeriksaan lokal. `createObjectKey` membuat key acak di server dan tidak menerima nama file, sehingga nama file browser tidak menjadi path object.

Package tidak memvalidasi isi/ukuran file, tidak menyimpan metadata ke PostgreSQL, tidak menghapus file lama otomatis, dan tidak menyediakan operasi baca/download privat. Terapkan pemeriksaan file serta urutan simpan/hapus pada aplikasi.
