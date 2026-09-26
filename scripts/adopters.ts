import { writeFile } from 'node:fs/promises';

interface SearchResponse {
  items: {
    repository: {
      full_name: string;
      fork: boolean;
    };
  }[];
}

const LINK = 'ai-policy.dev';
const OWN_REPO = '43081j/ai-policy';
const DATA_FILE = new URL('../data/adopters.json', import.meta.url);

// GitHub only returns 1000 results per query, so for now we keep it at 10 and a single batch
// The day we see we need more, we can start having multiple batches, but for now it's not needed.
const MAX_QUERY_PAGES = 10;

// The search endpoint requires authentication.
const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error(
    'GITHUB_TOKEN is required. Make sure to add it in your .env file.',
  );
  process.exit(1);
}

function github(path: string) {
  return fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      Authorization: `Bearer ${token}`,
    },
  });
}

async function search(): Promise<Set<string>> {
  const query = encodeURIComponent(`"${LINK}" extension:md`);
  const repos = new Set<string>();

  for (let page = 1; page <= MAX_QUERY_PAGES; page++) {
    const res = await github(
      `/search/code?q=${query}&per_page=100&page=${page}`,
    );

    if (!res.ok) {
      throw new Error(`Search failed: ${res.status} ${await res.text()}`);
    }

    const { items } = (await res.json()) as SearchResponse;

    for (const { repository } of items) {
      if (repository.fork || repository.full_name === OWN_REPO) {
        continue;
      }

      repos.add(repository.full_name);
    }

    if (items.length < 100) {
      break;
    }
  }

  return repos;
}

const adopters = [...(await search())].toSorted((a, b) => a.localeCompare(b));
await writeFile(DATA_FILE, `${JSON.stringify(adopters, null, 2)}\n`);

console.log(`Found ${adopters.length} adopters`);
