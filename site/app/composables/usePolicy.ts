function compareVersions(a: string, b: string) {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);

  return partsA.map((part, i) => part - (partsB[i] ?? 0)).find(Boolean) ?? 0;
}

export function usePolicy(slug: string, version?: string) {
  const path = version ? policyVersionPath(slug, version) : `/${slug}`;

  return useAsyncData(`policy:${path}`, async () => {
    const [policy, files] = await Promise.all([
      clientContent.get(path),
      clientContent.list(),
    ]);

    if (!policy) {
      return null;
    }

    const versionsPrefix = policyVersionPath(slug, '');
    const versions = files
      .filter((file) => file.path.startsWith(versionsPrefix))
      .map((file) => policySlug(file.path))
      .toSorted((a, b) => compareVersions(b, a));

    return {
      policy,
      path,
      version: version ?? policy.data.version,
      versions,
    };
  });
}
