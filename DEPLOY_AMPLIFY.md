# Deploying to AWS Amplify (eu-central-1)

This checklist walks through deploying this repo's static site (`public/`) to AWS Amplify in the Frankfurt region (`eu-central-1`).

1) Push your repo to GitHub

```bash
git add .
git commit -m "Add amplify config"
git push origin main
```

2) `amplify.yml` (already added)
- The repo includes `amplify.yml` which tells Amplify to publish the `public/` folder. No build commands are required for this simple static site.

3) Create the Amplify app (Console)
- Open AWS Console → Region: Europe (Frankfurt) (`eu-central-1`).
- Go to **AWS Amplify** → **Host web app** → **Get started**.
- Connect your Git provider (GitHub). Authorize and select your repo and `main` branch.
- Confirm build settings (Amplify will detect `amplify.yml`).
- Set artifact directory to `public` if not auto-detected.
- Click **Save and deploy**.

4) Domain & HTTPS
- In Amplify Console → **Domain management** → **Add domain** → enter your domain.
- If your domain is in Route 53: allow Amplify to manage DNS automatically.
- If your domain is at another registrar: Amplify will provide DNS records (A / CNAME). Add those records at your registrar.
- Amplify requests an ACM certificate and will enable HTTPS automatically after validation (free).

5) Recommended Amplify settings
- Rewrites / redirects: add rule `Source: /*` `Target: /index.html` `Status: 200` (SPA support).
- Enable branch auto-builds for `main` so pushes auto-deploy.

6) Post-deploy checks
- Visit the Amplify-assigned domain (or your custom domain) over HTTPS.
- Verify the site loads and the WhatsApp button opens `https://wa.me/972508391268`.
- Check certificate status in Amplify Domain Management; it should show **Issued**.

7) Optional: local CLI publish
- Install Amplify CLI if you want to publish from your machine (not required):

```bash
npm install -g @aws-amplify/cli
amplify configure    # one-time: connect CLI to your AWS account
amplify add hosting  # follow prompts
amplify publish
```

Troubleshooting
- If DNS changes take time to propagate, wait up to 24 hours but usually it's a few minutes to an hour.
- If SSL certificate is stuck in validation, double-check DNS entries were added correctly.

If you want, I can also: (A) connect the repo from the Console while you watch, or (B) create a GitHub Actions workflow that pushes a build artifact to Amplify via the Amplify Admin API. Which do you prefer?
