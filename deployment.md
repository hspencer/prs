# Deployment Guide — Reveal.js + Vite → GitHub Pages 

>live at [herbertspencer.net/prs](https://herbertspencer.net/prs)

This document describes, in full detail, how to deploy the Reveal.js + Vite presentation to GitHub Pages using **Option 1 (branch `gh-pages`)** and, as an alternative, **Option 2 (branch `main` with `/docs`)**. It includes environment setup, build commands, deployment commands, verification procedures, and troubleshooting steps.

---

## 0) Preconditions

- Node.js and npm installed.
- Git installed and available in PATH (`git --version`).
- A GitHub account with access to the repository `hspencer/prs`.
- Local working copy with the `main` branch checked out.
- Vite configured with:
  - `base: '/prs/'`
  - `build.outDir: 'docs'`

> Rationale: In a GitHub Project Page hosted at `https://<user>.github.io/<repo>/`, Vite must emit paths relative to the repository path (`/prs/`). The `docs/` directory is the output directory consumed by GitHub Pages (either pushed to `gh-pages` or committed under `main`).

---

## 1) Repository Remote — SSH (recommended)

The `gh-pages` package performs a direct `git push` to the remote. Using SSH avoids credential prompts in each deployment.

```bash
cd /path/to/prs

# Ensure remote uses SSH
git remote set-url origin git@github.com:hspencer/prs.git
git remote -v

# SSH connectivity
ssh -T git@github.com
# Expected: "Hi hspencer! You've successfully authenticated, but GitHub does not provide shell access."
```

If you see `Permission denied (publickey)`, create and register an SSH key, add it to the agent, and retry.

---

## 2) Option 1 — Deploy to branch `gh-pages` (using the `gh-pages` package)

### 2.1 Build locally

```bash
# From branch main
git checkout main
npm ci            # or: npm install
npm run build     # emits docs/ with index.html + assets
ls -la docs
```

### 2.2 Publish to the remote `gh-pages` branch

Use an explicit command the first time (verbose, nojekyll, author, message):

```bash
npx gh-pages -d docs -b gh-pages -t true   -u "Herbert Spencer <hspencer@ead.cl>"   -m "deploy $(date -u +'%F %T UTC')" -v
```

Notes:
- `-d docs` selects the directory to publish.
- `-b gh-pages` selects the remote branch.
- `-t true` writes `.nojekyll` to prevent Jekyll processing on GitHub Pages.
- `-u` sets the author used in the generated commit.
- `-m` sets the commit message (include a timestamp for auditability).
- `-v` prints a detailed log of the publication.

You can also keep a script in `package.json`:

```jsonc
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d docs -b gh-pages -t true -u "Herbert Spencer <hspencer@ead.cl>" -m "deploy $(date -u +'%F %T UTC')" -v",
    "postdeploy": "git switch -"
  }
}
```

Then run:

```bash
npm run deploy
```

The `postdeploy` returns to the previous branch (normally `main`), ensuring the working tree does not remain on `gh-pages`.

### 2.3 GitHub configuration

In the repository (web UI):

- **Settings → Pages**
  - **Source**: `Deploy from a branch`
  - **Branch**: `gh-pages`
  - **Folder**: `/ (root)`

### 2.4 Verification (remote state)

```bash
# Confirm latest commit on gh-pages
git fetch origin gh-pages
git log -1 --oneline origin/gh-pages

# List a sample of files published
git ls-tree --name-only -r origin/gh-pages | head

# (Optional) Compare local docs/ vs remote gh-pages with a worktree
git worktree add ../prs-ghp origin/gh-pages
diff -rq docs ../prs-ghp | sed -n '1,60p'   # first 60 differences
```

If you use the worktree comparison, remove it when finished:

```bash
git worktree remove ../prs-ghp
```

### 2.5 Local preview of the built artefacts

This confirms what will be served remotely (no dev server). Choose **one** method:

```bash
# Using http-server (install once: npm i -g http-server)
http-server docs -p 5174

# Or using Vite preview against docs (Vite v5+ supports --outDir)
npx vite preview --outDir docs --strictPort --port 5174 --base /prs/
```

Open `http://localhost:5174/prs/` or `http://localhost:5174/` depending on the chosen server and base handling.

---

## 3) Option 2 — Deploy from `main` with `/docs` (without `gh-pages`)

If you prefer not to use the `gh-pages` branch:

1. **Settings → Pages**:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/docs`

2. Build and commit the artefacts:

```bash
git checkout main
npm ci
npm run build
git add docs
git commit -m "build: publish to GitHub Pages from main/docs"
git push origin main
```

GitHub Pages will serve `/docs` from `main` automatically.

---

## 4) Troubleshooting

### 4.1 “The published site does not match my local dev”

Possible causes and checks:

- **Deployment not executed or failed silently**:  
  - Re-run with verbose and review output:  
    `npx gh-pages -d docs -b gh-pages -t true -u "... " -m "... " -v`  
  - Check remote branch head:  
    `git fetch origin gh-pages && git log -1 --oneline origin/gh-pages`

- **Pages pointing to the wrong branch/folder**:  
  - Confirm **Settings → Pages** matches your chosen option (2 or 3).

- **Base path mismatch**:  
  - In a Project Page the public URL is `https://<user>.github.io/<repo>/`.  
  - Vite requires `base: '/<repo>/'`. For repository `prs`: `base: '/prs/'`.

- **Cache (local browser or CDN edge)**:  
  - Vite fingerprints assets (e.g., `index-XYZ.css`), which mitigates stale caching.  
  - Hard-reload the page or append a query parameter to `index.html` when testing (`?v=ts`).  
  - Ensure the *new* `index.html` was published (worktree diff or `git show origin/gh-pages:index.html | head -n 30`).

- **Wrong URL visited**:  
  - Ensure you open the Project Page URL (`…/prs/`), not the User Page root (`…github.io/`).

- **Protected branch / push blocked**:  
  - If `gh-pages` is protected, remove protection or delete/recreate the branch:  
    ```bash
    git push origin --delete gh-pages
    npx gh-pages -d docs -b gh-pages -t true -u "Herbert Spencer <hspencer@ead.cl>" -m "recreate gh-pages" -v
    ```

- **Service Workers**:  
  - If you ever added a PWA plugin, old service workers may cache aggressively.  
  - Unregister them in the browser DevTools (Application → Service Workers).

### 4.2 “spawn git ENOENT” during `gh-pages`

- Git is not in PATH. Install Git, reopen terminal, re-run.
- Verify `which git` and `git --version`.

### 4.3 “Permission denied (publickey)” over SSH

- Create an SSH key (`ssh-keygen -t ed25519 -C "you@example.com"`), add it to the agent, register the public key in GitHub, and use an SSH remote (`git@github.com:hspencer/prs.git`).

### 4.4 Styles not applied (overrides lost)

- Ensure the **order** of CSS imports: load `reveal.css` first, then your `custom.scss` in `main.js`.  
- Do **not** import `reveal.scss` inside `custom.scss`; use the precompiled CSS of Reveal.  
- Build and verify that your rules appear at the end of `docs/assets/index-*.css`.

### 4.5 404s on assets after publishing

- Usually a `base` issue. Confirm `base: '/prs/'` (exact repository name, case-sensitive).  
- Inspect the built `index.html` for `<link href="/prs/assets/...">` and `<script src="/prs/assets/...">`.

---

## 5) Rollback / Clean Redeploy

To reset the published branch and redeploy from a clean state:

```bash
git push origin --delete gh-pages
npx gh-pages -d docs -b gh-pages -t true   -u "Herbert Spencer <hspencer@ead.cl>"   -m "clean redeploy $(date -u +'%F %T UTC')" -v
```

---

## 6) Notes on GitHub Actions and Environments

This deployment flow does **not** use GitHub Actions or *Environments*. The `gh-pages` package performs a direct `git push` to the `gh-pages` branch. The GitHub Pages service then serves static files from that branch according to the repository’s **Settings → Pages** configuration.

---

## 7) Minimal Command Sequences

### 7.1 Option 1 (branch `gh-pages`)

```bash
# One-time
git remote set-url origin git@github.com:hspencer/prs.git
ssh -T git@github.com

# Each deploy
git checkout main
npm ci
npm run build
npx gh-pages -d docs -b gh-pages -t true   -u "Herbert Spencer <hspencer@ead.cl>"   -m "deploy $(date -u +'%F %T UTC')" -v
git switch -   # return to previous branch if needed
```

### 7.2 Option 2 (branch `main` /docs)

```bash
git checkout main
npm ci
npm run build
git add docs
git commit -m "build: publish to GitHub Pages from main/docs"
git push origin main
```

---

## 8) Local Sanity Checks Before Publishing

1. `npm run build`
2. Open local preview of `docs/` (http-server or `vite preview --outDir docs`).
3. Verify in `docs/index.html` that asset paths start with `/prs/`.
4. Confirm that `docs/assets/index-*.css` contains your overrides at the end.
5. Proceed with deployment.
6. If remote looks stale, run the worktree diff to confirm the published files match the build.

### Secuencia recomendada

```bash
npx gh-pages-clean       
rm -rf docs              
npm ci || npm install
npm run build            
test -f docs/index.html && echo "OK: docs listo" || echo "ERROR: falta docs/index.html"
```