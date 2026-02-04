Release notes integration

This folder is for CI-generated release note fragments from the ShaleGame repository.

How to integrate:

1. In your ShaleGame repo CI, after creating a release, write the release notes (markdown) to this site's repository by adding a file at `src/content/releases/latest.md`.
2. The file should be raw HTML or markdown depending on how you'd like to render it. If markdown, ensure the site build step converts/imports it (Astro can import `.md` files as components or you can pre-render to HTML).
3. If the ShaleGame repo is private or source-available requiring auth, configure a GitHub token in the Pages build or use a workflow that commits directly to this repo.

Notes:
- This site currently links to the GitHub releases page by default. No release notes are embedded yet.
- If you want me to scaffold a fetch-and-write workflow, I can add a sample GitHub Action that queries the GitHub Releases API and commits `latest.md` to this repo; you'll need to provide a Personal Access Token with repo access.
