# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Calver](https://calver.org) with a version format of `YY.0M.MICRO`.

## [Unreleased]

### Added

- Fine-grain controls over timeouts from [@hharnisc](https://github.com/hharnisc)
- Option to filter commits by deploy context [@dnsv](https://github.com/dnsv)
- Docker Compose configuration for development
- `eslint` and configuration
- `prettier` and configuration
- `@vercel/ncc` to build the action as recommended in the GitHub documentation
- CircleCI for running linters and tests
- Dependabot for dependency updates
- GitHub settings to manage repository

### Changed

- Update action to use `node16`
- Update package manager from `npm` to `yarn`
- Update dependencies
- Remove `node_modules` from repository

---

Forked to `mutations/wait-for-netlify-action` - 2022-02-08

- Last version before fork: 3.2.0 [0855dad](https://github.com/mutations/wait-for-netlify-action/commit/0855dade13fa1445d67907d2b5b2ce470e38c468)

---

Changelog sections:

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Fixed` for any bug fixes.
- `Removed` for now removed features.
- `Security` in case of vulnerabilities.
