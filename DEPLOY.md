# Host this app as a live webpage (free options)

Your app is a **Vite + React** project. Build it once, then upload the `dist/` folder to any static host. Below are the easiest **free** ways to get a public URL.

---

## Option 1: Vercel (recommended – very quick)

1. **Push your code to GitHub** (see HOSTING.md if you haven’t).
2. Go to [vercel.com](https://vercel.com) and sign in with **GitHub**.
3. Click **Add New…** → **Project**.
4. **Import** your GitHub repository (e.g. `dit-use-case-ui` or whatever you named it).
5. Leave settings as-is:
   - **Framework Preset:** Vite  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `dist`  
   - **Install Command:** `npm install`
6. Click **Deploy**.
7. In about a minute you’ll get a URL like:  
   `https://your-project-name.vercel.app`  
   Share this link; anyone can open it in a browser.

**Updates:** Push to GitHub → Vercel automatically rebuilds and updates the live site.

---

## Option 2: Netlify

1. Push your code to **GitHub**.
2. Go to [netlify.com](https://netlify.com) and sign in with **GitHub**.
3. **Add new site** → **Import an existing project** → choose **GitHub** and your repo.
4. Set:
   - **Build command:** `npm run build`  
   - **Publish directory:** `dist`
5. Click **Deploy site**.
6. You’ll get a URL like:  
   `https://something-random.netlify.app`  
   (You can change the name in Site settings → Domain management.)

**Updates:** Push to GitHub → Netlify auto-deploys.

---

## Option 3: GitHub Pages

1. Push your code to GitHub.
2. In your repo, go to **Settings** → **Pages**.
3. Under **Source** choose **GitHub Actions**.
4. In your project, create the file **`.github/workflows/deploy.yml`** with the contents below (creates the workflow file).
5. Commit and push. GitHub will run the workflow and publish the site.
6. Your site will be at:  
   `https://YOUR_USERNAME.github.io/REPO_NAME/`

**Important:** For GitHub Pages, the app must be built with a **base path**. Add this to `vite.config.js` (see DEPLOY.md in the repo for the exact snippet).

---

## One-time: build locally (to test before deploying)

From the project folder:

```bash
npm run build
```

Then open `dist/index.html` in a browser, or run:

```bash
npm run preview
```

and open the URL shown (e.g. http://localhost:4173). This is what the hosted site will look like.

---

## Summary

| Service       | URL you get                          | Best for              |
|---------------|--------------------------------------|------------------------|
| **Vercel**    | `your-project.vercel.app`           | Easiest, auto deploy   |
| **Netlify**   | `your-site.netlify.app`             | Same idea as Vercel    |
| **GitHub Pages** | `username.github.io/repo-name`   | Free, no extra account |

For most people, **Vercel** or **Netlify** with a connected GitHub repo is the fastest way to get a live webpage others can access.
