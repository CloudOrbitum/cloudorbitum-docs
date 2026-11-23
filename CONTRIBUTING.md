# Contributing to the CloudOrbitum developer documentation

Everyone, including people who are not part of the CloudOrbitum organisation, is welcome to contribute.

- Learn how to contribute on the [Contributions page](https://developers.cloudorbitum.com/style-guide/contributions/) of the CloudOrbitum style guide (source: `src/content/docs/style-guide/contributions.mdx`).
- Check the [style guide](https://developers.cloudorbitum.com/style-guide/) for writing, formatting and frontmatter, and the [components](https://developers.cloudorbitum.com/style-guide/components/) for tabs, steps, asides and cards.

## Filing an issue

**For a new page or a larger change, open an issue before a pull request.** That way we can agree on the approach before you spend time on it. Use one of the issue templates:

- **Request content update**: fix or clarify an existing page.
- **Request content addition**: ask for a new page or section.
- **Docs website error**: report a problem with the site itself.

**You don't need an issue for small fixes**, such as a typo or a broken link. Open a pull request directly.

**Never report a security problem in an issue.** Follow [SECURITY.md](SECURITY.md).

## Making a pull request

1. Fork the repository and create a branch.
2. Run the site locally:

   ```sh
   docker compose up --build dev    # or: npm install && npm run dev
   ```

   Open http://localhost:1111. Pages reload as you save.
3. Make your change. Every page is an MDX file in `src/content/docs/`; see the Contributions page for where everything else lives.
4. Check it:

   ```sh
   npm run check
   npm run build
   npm run lint:docs
   ```

5. Open a pull request against `main`. Start the title with the product in brackets, for example `[Connect] Fix broken link`, and fill in the template.

A member of the docs team reviews your pull request. If they need more information, they add the `more-information-needed` label; without a reply within 14 days, the pull request closes automatically.

### IDE configuration files

Keep machine-specific files (such as `.idea/` or `.vscode/` settings) out of the repository. Add them to a [global `.gitignore`](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files#configuring-ignored-files-for-all-repositories-on-your-computer).

## Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Violating it can lead to a warning or a ban from the project.

## Contact

For questions about contributing, email [opensource@cloudorbitum.com](mailto:opensource@cloudorbitum.com).

Thank you for helping keep the CloudOrbitum docs accurate.
