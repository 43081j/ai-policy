# ⚖️ AI Policies

A small collection of ready-to-use AI contribution policies for open source
projects. Pick the one that matches how you want AI tooling used in your
project, drop it into your repository, and point contributors at it.

## 📖 Browse the policies

The full list lives at [ai-policy.dev](https://ai-policy.dev/), where each
policy can be compared side by side, copied, or downloaded. The source markdown
lives in [`policies/`](./policies).

## Contributing a policy

1. Copy [`policies/_template.md`](./policies/_template.md) to
   `policies/<name>.md`.
2. Fill in the frontmatter: the `name` shown on the site, the `version`
   (start at `1.0.0`), a one-sentence `tagline`, the `created` date, and the
   `rules` the policy `permits`, `requires`, and `forbids`. Rule IDs come from
   [`site/app/utils/policy.ts`](./site/app/utils/policy.ts).
3. Write the policy body under the `AI Contribution Policy` heading, followed
   by a short `Summary` list. The website adds an attribution line with the
   version's permalink and the license when the policy is copied or
   downloaded.
4. Commit the new file in `policies/versions/`. `npm run dev` and
   `npm run policies:snapshot` write it for you. If you forget, autofix.ci adds
   it to your pull request.
5. Run `npm run lint` and, if you want to see it rendered, `npm run dev`.

## Versions

Each policy has its own [semantic version](https://semver.org/) in its
frontmatter. When you change a policy, bump its `version` and set its `updated`
date:

- **Major:** a substantial change to obligations, rights, scope, or
  enforcement.
- **Minor:** clarifications, new examples, or added sections that don't change
  what anyone is committing to.
- **Patch:** typos, formatting, and similar fixes.

Every version is kept in `policies/versions/<name>/<version>.md` and is
permanently available at `https://ai-policy.dev/policies/<name>/<version>`.
Once a version is on `main`, its snapshot never changes, so any further change
to the policy, even a typo fix, needs a new version.

Snapshots are written by `npm run dev` and `npm run policies:snapshot`. On pull
requests, autofix.ci commits missing or outdated snapshots automatically.

When a new version reaches `main`, a GitHub release tagged `<name>@<version>`
is created automatically. Its notes contain the diff against the previous
version and the commits that changed the policy. The website links every
version to its release.

## License

The policies in [`policies/`](./policies) are licensed under
[CC BY-SA 4.0](./policies/LICENSE). The website and tooling are licensed under
[MIT](./LICENSE).
