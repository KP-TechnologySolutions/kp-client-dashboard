# Deploying to DreamHost VPS

Complete step-by-step guide to get the KP Client Dashboard running on your DreamHost VPS.

## Prerequisites

- DreamHost VPS with SSH access
- A domain or subdomain pointed to your VPS (e.g., `portal.kptechnology.com`)
- Your VPS IP address and SSH credentials

## Step 1: SSH into your VPS

Open Terminal and connect:

```bash
ssh your-username@your-vps-ip
```

If you don't know your SSH credentials, go to:
**DreamHost Panel > VPS > Users** — your username and server hostname are listed there.

## Step 2: Install Node.js

Check if Node.js is already installed:

```bash
node --version
```

If it's not installed or below v18, install it:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:

```bash
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x
```

## Step 3: Install PM2 (keeps the app running)

```bash
sudo npm install -g pm2
```

## Step 4: Clone the project

```bash
cd ~
git clone https://github.com/KP-TechnologySolutions/kp-client-dashboard.git
cd kp-client-dashboard
```

## Step 5: Create the environment file

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://dnnqqcsupbzbcidguqsg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_8eS5aiR3zcgoQqFC2gHdYg_AmRJHwk1
PORT=3000
EOF
```

## Step 6: Install dependencies and build

```bash
npm install
npm run build
```

This takes 1-2 minutes. You should see "Generating static pages" and no errors.

## Step 7: Copy static files to standalone

The standalone build needs the static files and public folder copied in:

```bash
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
```

## Step 8: Test it

```bash
node .next/standalone/server.js
```

Open your browser to `http://your-vps-ip:3000` — you should see the login page. Press `Ctrl+C` to stop.

## Step 9: Run with PM2

```bash
pm2 start .next/standalone/server.js --name kp-dashboard
pm2 save
pm2 startup
```

The last command will print a command you need to run with `sudo` — copy and run it. This makes the app start automatically if the VPS reboots.

Check it's running:

```bash
pm2 status
```

## Step 10: Set up Nginx reverse proxy

This lets your domain (e.g., `portal.kptechnology.com`) point to the app and adds HTTPS.

Install Nginx if not already installed:

```bash
sudo apt-get install -y nginx
```

Create the site config:

```bash
sudo nano /etc/nginx/sites-available/kp-dashboard
```

Paste this (replace `portal.kptechnology.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name portal.kptechnology.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save (`Ctrl+X`, then `Y`, then `Enter`).

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/kp-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 11: Add HTTPS with Let's Encrypt

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d portal.kptechnology.com
```

Follow the prompts — it will automatically configure SSL. Choose to redirect HTTP to HTTPS when asked.

## Step 12: Point your domain

In your DreamHost Panel (or wherever you manage DNS):

1. Go to **Manage Domains** or **DNS**
2. Add an **A record** for `portal.kptechnology.com` pointing to your VPS IP address

It can take a few minutes to propagate.

---

## Updating the app in the future

SSH into your VPS and run:

```bash
cd ~/kp-client-dashboard
git pull
npm install
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
pm2 restart kp-dashboard
```

That's it — takes about 30 seconds.

---

## Troubleshooting

**App won't start?**
```bash
pm2 logs kp-dashboard
```

**Port 3000 already in use?**
```bash
pm2 delete kp-dashboard
pm2 start .next/standalone/server.js --name kp-dashboard
```

**Nginx not working?**
```bash
sudo nginx -t          # Check config syntax
sudo systemctl status nginx  # Check if running
```

**SSL certificate expired?**
```bash
sudo certbot renew
```
Certbot auto-renews, but you can force it if needed.

**Check what's running:**
```bash
pm2 status             # App processes
sudo systemctl status nginx  # Web server
```
