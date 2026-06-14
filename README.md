# BlogSpace (Deployment-ready)

## Local Development

### Server
```bash
cd server
npm install
npm run dev
```
Server runs on `http://localhost:5000` by default.

### Client
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:3000`.

## Environment variables

See:
- `server/.env.example`
- `client/.env.example`

### Required variables (server)
Create `server/.env` from `server/.env.example`.

## Production build (manual)
1) Build client:
```bash
cd client
npm run build
```
2) Start server (ensure `server/.env` is set) and deploy uploads + client dist using your host.

## Uploads
Uploaded files are stored in `server/uploads/` and served at `/uploads`.

