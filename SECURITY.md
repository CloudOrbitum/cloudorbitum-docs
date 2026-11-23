# Security policy

## Reporting a vulnerability

**Don't open a public issue or pull request for a security problem.** Report it privately, by either:

- **GitHub private vulnerability reporting:** go to [Security > Report a vulnerability](https://github.com/CloudOrbitum/cloudorbitum-docs/security/advisories/new) in this repository.
- **Email:** [security@cloudorbitum.com](mailto:security@cloudorbitum.com). If you encrypt your message, put the encrypted text in the body of the email.

Include:

- What the problem is and where it is (URL, file or component)
- Steps to reproduce it
- What an attacker could do with it

We acknowledge reports within 3 business days and keep you informed until the problem is fixed. Please give us reasonable time to fix it before you disclose it publicly.

## Scope

In scope:

- The documentation site at [developers.cloudorbitum.com](https://developers.cloudorbitum.com/), and its source in this repository
- This repository's build and deployment (GitHub Actions workflows, Docker images)

Vulnerabilities in the Orbitum platform itself (the console, API, CLI, SDKs or agents) are in scope too: report them the same way.

## Secrets in the docs

If you find a real credential, key or customer data in this repository or on the site, report it as a vulnerability. Examples in the docs must use sample values only (`acme-demo`, `example.com`, `203.0.113.0/24`).

## Abuse

To report abuse of the Orbitum platform (spam, phishing or malicious content hosted by an Orbitum customer), email [abuse@cloudorbitum.com](mailto:abuse@cloudorbitum.com).
