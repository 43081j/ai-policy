# ⚖️ AI Policies

A small collection of ready-to-use AI contribution policies for open source
projects. Pick the one that matches how you want AI tooling used in your
project, drop it into your repository, and point contributors at it.

## 📖 Browse the policies

The full list lives at [ai-policy.dev](https://ai-policy.dev/), where each
policy can be compared side by side, copied, or downloaded. The source markdown
lives in [`policies/`](./policies).

Maintainers can use the [policy finder](https://ai-policy.dev/quiz) to see which
policy best matches their answers about AI use in contributions.

## Contributing a policy

1. Copy [`policies/_template.md`](./policies/_template.md) to
   `policies/<name>.md`.
2. Fill in the frontmatter: the `name` shown on the site, the `version`
   (start at `1.0.0`), a one-sentence `tagline`, the `created` date, and the
   `rules` the policy `permits`, `requires`, and `forbids`. Rule IDs come from
   [`site/app/utils/policy.ts`](./site/app/utils/policy.ts).
3. Write the policy body under the `AI Contribution Policy` heading, followed
   by a short `Summary` list. The website adds an attribution line with the
   version's permalink when the policy is copied or downloaded.
4. Copy the finished file to `policies/versions/<name>/1.0.0.md`.
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
After changing a policy, copy it to a new file there, named after its new
version. Once a version is on `main`, its file never changes, so any further
change to the policy, even a typo fix, needs a new version.

## License

[MIT](./LICENSE)
