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
2. Fill in the frontmatter: a one-sentence `tagline`, a one-sentence
   `enforcement`, and the `rules` the policy applies. Rule IDs come from
   [`site/app/utils/policy.ts`](./site/app/utils/policy.ts)
3. Write the policy body under the `AI Contribution Policy` heading, followed
   by a short `Summary` list and the link back to the website.
4. Run `npm run lint` and, if you want to see it rendered, `npm run dev`.

## License

[MIT](./LICENSE)
