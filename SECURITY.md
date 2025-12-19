# Security Policy

Thank you for helping keep this project and its users safe.

## Reporting a Vulnerability

- Please report security issues privately and responsibly.
- Preferred methods:
    - GitHub Security Advisory: https://github.com/MohitRathi14/Personal-Finance-Assistant/security/advisories/new

Please include:
- A clear description of the issue and potential impact
- Steps to reproduce (proof of concept if possible)
- Affected versions/commit(s) and environment details
- Any mitigation or workaround you’re aware of

Do not open a public issue for security vulnerabilities.

## Response Timeline

- Acknowledgement: within 2 business days
- Initial assessment: within 5 business days
- Coordinated fix + release: target within 90 days (complex cases may take longer)

We’ll keep you updated on progress and coordinate disclosure timing. Credit will be given to reporters who request it.

## Scope

Security reports are welcome for:
- Backend (Node.js/Express, authentication/authorization, sensitive data handling)
- Frontend (React/Vite), including XSS, CSRF, and supply-chain injection risks
- CI/CD and repository configuration (secrets exposure, automation risks)
- Dependency vulnerabilities that affect this project’s runtime or build

Out-of-scope examples:
- Reports without a clear security impact
- Best-practice suggestions without a demonstrable risk
- Vulnerabilities in third-party services outside our control

## Supported Versions

We provide security fixes for:
- main branch (active development)
- Latest stable release line

Older versions may receive fixes at our discretion. Please upgrade to the latest release when possible.

## Safe Harbor

We support good-faith research:
- Do not access, modify, or exfiltrate user data
- Avoid service disruption or degradation
- Respect rate limits and only test against your own data
- Follow applicable laws

If you follow these guidelines, we will not initiate legal action and will work with you to resolve issues responsibly.