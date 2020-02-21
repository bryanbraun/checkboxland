# Checkboxland Docs

There's a few unique things about these docs.

1. The index file is up one directory, but everything else is in the `/docs`.

This allows us to host the docs on `github-pages`, while always having the docs link to the latest version of the library in source. The benefits include:
- Being able to build and use the library side-by-side in the same repo.
- Being able to smoke-test for regressions on any PR by checking the existing demos.
- Avoiding watch tasks, custom build scripts, or other complexity.

2. The docs are written in raw HTML.

- This mostly because there aren't that many docs and it saves me from needing to setup a markdown parser with a build & watch step.


