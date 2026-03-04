# Host this project on GitHub and give others edit access

## 1. Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in.
2. Click the **+** (top right) → **New repository**.
3. Choose a **Repository name** (e.g. `rbi-entity-dashboard` or `dit-use-case-ui`).
4. Set visibility to **Public** or **Private**.
5. **Do not** check “Add a README” (you already have code).
6. Click **Create repository**.

## 2. Push your code from your computer

In a terminal, from this project folder (`dit use case ui`), run:

```bash
# Initialize Git (if not already)
git init

# Add all files (respects .gitignore)
git add .

# First commit
git commit -m "Initial commit: RBI Entity Dashboard React app"

# Rename default branch to main (optional, GitHub’s default)
git branch -M main

# Add your new GitHub repo as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and `REPO_NAME` with the repository name you chose.

If the folder name has spaces, use quotes:

```bash
cd "/Users/harikrishna/dit use case ui"
```

## 3. Give other people access to edit

1. Open your repository on GitHub.
2. Go to **Settings** → **Collaborators** (or **Collaborators and teams**).
3. Click **Add people**.
4. Enter their GitHub username or email and choose **Write** (or **Admin** if they should manage settings).
5. They accept the invite from their email or GitHub notifications.

After that they can:

- **Clone:** `git clone https://github.com/YOUR_USERNAME/REPO_NAME.git`
- **Edit** and **push:** they need to commit and push their changes; you pull to get them.

## 4. Optional: run the app after clone

Anyone who clones the repo can run:

```bash
cd REPO_NAME
npm install
npm run dev
```

Then open the URL shown (e.g. http://localhost:4173).

## 5. If you already have a repo and only want to push

If you already ran `git init` and added a remote:

```bash
git add .
git commit -m "Your message"
git push
```

---

**Summary:** Create repo on GitHub → `git init`, `git add .`, `git commit`, `git remote add origin`, `git push` → add collaborators in **Settings → Collaborators** with **Write** access.
