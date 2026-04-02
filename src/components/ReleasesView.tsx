import { useState, useEffect, useRef } from 'preact/hooks';
import { marked } from 'marked';

const API_URL = 'https://api.github.com/repos/ShaleGame/ShaleGame/releases';

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface Release {
  id: number;
  name: string;
  tag_name: string;
  prerelease: boolean;
  published_at: string;
  body: string;
  assets: ReleaseAsset[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ReleaseBody({ markdown }: { markdown: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = marked.parse(markdown) as string;
    }
  }, [markdown]);
  return <div class="release-body" ref={ref} />;
}

function ReleaseEntry({ release }: { release: Release }) {
  const [open, setOpen] = useState(false);
  const hasBody = Boolean(release.body?.trim());

  return (
    <article class="release-entry">
      <div class="release-meta">
        <h2 class="release-name">{release.name || release.tag_name}</h2>
        <span class="release-tag">{release.tag_name}</span>
        {release.prerelease && (
          <span class="release-prerelease">Pre-release</span>
        )}
        <time class="release-date" datetime={release.published_at}>
          {formatDate(release.published_at)}
        </time>
      </div>

      {release.assets.length > 0 && (
        <div class="release-assets">
          <h4>Downloads</h4>
          <div class="asset-list">
            {release.assets.map((asset) => (
              <a
                key={asset.browser_download_url}
                class="asset-link"
                href={asset.browser_download_url}
                download
              >
                ↓ {asset.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {hasBody && (
        <details
          class="release-details"
          onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
        >
          <summary class="release-details-toggle">Release Notes</summary>
          {open && <ReleaseBody markdown={release.body} />}
        </details>
      )}
    </article>
  );
}

export default function ReleasesView() {
  const [releases, setReleases] = useState<Release[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);
        return res.json() as Promise<Release[]>;
      })
      .then((data) => setReleases(data))
      .catch((err) => {
        console.error('Releases fetch error:', err);
        setError('Failed to load releases. Please visit the GitHub releases page directly.');
      });
  }, []);

  if (error) {
    return <p class="state-msg">{error}</p>;
  }

  if (releases === null) {
    return <p class="state-msg">Loading releases…</p>;
  }

  if (releases.length === 0) {
    return <p class="state-msg">No releases found.</p>;
  }

  return (
    <div>
      {releases.map((release) => (
        <ReleaseEntry key={release.id} release={release} />
      ))}
    </div>
  );
}
