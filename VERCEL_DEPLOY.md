# 🚀 Deploy ke Vercel

## Langkah-langkah:

### 1. Login ke Vercel
```bash
vercel login
```

### 2. Deploy Project
```bash
vercel
```

### 3. Deploy ke Production
```bash
vercel --prod
```

## Konfigurasi Otomatis

File-file berikut sudah dikonfigurasi untuk Vercel:

### `vercel.json`
- Static file serving
- Route configuration  
- Environment setup

### `index.html`
- Landing page yang redirect ke main.html
- Backup entry point

### `.vercelignore`
- Exclude files yang tidak perlu di deploy
- Optimasi size deployment

## Environment Variables (Opsional)

Jika perlu environment variables, set di Vercel dashboard:
- `NODE_ENV=production`
- `API_BASE_URL=https://your-vercel-url.vercel.app`

## Custom Domain (Opsional)

1. Buka Vercel dashboard
2. Settings → Domains
3. Tambahkan custom domain Anda

## Auto-deployment

Vercel akan otomatis deploy setiap push ke main branch!
