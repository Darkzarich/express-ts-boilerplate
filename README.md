Boilerplate/template repository for starting an **Express 5 + TypeScript 7** API project, using native ES modules and tested with Vitest and [supertest](https://github.com/forwardemail/supertest).

To create a repository based on this template, simply click the "Use this template" button above.

### What's included

- **Express 5** app built by a `createApp(config)` factory, with JSON 404 and error handlers that never leak internal error details
- **Security defaults**: [helmet](https://helmetjs.github.io/) headers, configurable CORS and per-IP [rate limiting](https://github.com/express-rate-limit/express-rate-limit)
- **Validated config**: environment variables are parsed with [zod](https://zod.dev/) at startup and fail fast with a readable error
- **Production readiness**: `/health` endpoint and graceful shutdown on `SIGTERM`/`SIGINT`
- **Tooling**: TypeScript 7 (`tsc`), Node's built-in TypeScript support for development, Vitest, Oxlint, Prettier
- **CI**: GitHub Actions running audit, formatting, lint, type checks, tests and build on Node 22.18 and 24, plus Dependabot

### Requirements

- Node.js 22.18 or newer (see `.nvmrc`, run `nvm use` to switch)

### Getting started

```sh
npm install
cp .env.example .env
npm run start:dev:watch
```

### Scripts

| Command                   | Description                                         |
| ------------------------- | --------------------------------------------------- |
| `npm run start:dev`       | Run the app from TypeScript sources with Node       |
| `npm run start:dev:watch` | Same as above, restarting on file changes           |
| `npm run build`           | Compile to `dist/`                                  |
| `npm start`               | Run the compiled app from `dist/`                   |
| `npm test`                | Run tests once with Vitest                          |
| `npm run test:watch`      | Run tests in watch mode                             |
| `npm run test:coverage`   | Run tests with a coverage report                    |
| `npm run lint`            | Lint with Oxlint (including type-aware rules)       |
| `npm run lint:fix`        | Lint and apply safe automatic fixes                 |
| `npm run lint:types`      | Type-check app and test sources                     |
| `npm run format`          | Format all files with Prettier                      |
| `npm run format:check`    | Check formatting without writing changes            |
| `npm run check`           | Run formatting, lint, type checks and tests at once |

### Configuration

Environment variables are defined and validated in `src/configs/env.config.ts`. The dev scripts load a `.env` file if present; in production, provide real environment variables instead.

| Variable               | Default       | Description                                                                |
| ---------------------- | ------------- | -------------------------------------------------------------------------- |
| `NODE_ENV`             | `development` | `development`, `production` or `test`                                      |
| `HOST`                 | `0.0.0.0`     | Interface to listen on                                                     |
| `PORT`                 | `3000`        | Port to listen on                                                          |
| `CORS_ORIGIN`          | `*`           | Comma-separated allowed origins, or `*` for any. Restrict it in production |
| `TRUST_PROXY`          | `0`           | Number of reverse proxies in front of the app, so client IPs are correct   |
| `RATE_LIMIT_WINDOW_MS` | `60000`       | Rate limit window in milliseconds                                          |
| `RATE_LIMIT_MAX`       | `100`         | Max requests per client IP per window; `0` disables it                     |

### Notes on the toolchain

- Node runs `.ts` files directly by [stripping types](https://nodejs.org/api/typescript.html), so only erasable TypeScript syntax is allowed (no `enum`s, `namespace`s or parameter properties). `tsc` enforces this via `erasableSyntaxOnly`. Relative imports must use the `.ts` extension; `tsc` rewrites them to `.js` on build.
- Tests are transpiled by Vitest without type checking, so run `npm run lint:types` (or `npm run check`) to catch type errors. CI does this automatically.
- Linting uses [Oxlint](https://oxc.rs/docs/guide/usage/linter) rather than ESLint: `typescript-eslint` does not support TypeScript 7 yet, while Oxlint's type-aware rules (such as `no-floating-promises`) are built on it. Rules are configured in `.oxlintrc.json`.

### Precautions

It uses a **folder-by-type structure**, which is suitable for **small projects** (~10 files in each type).

As your project grows it will become more difficult to find the file you're actually looking for.

If you intend to build a large project I'd highly recommend using a **folder-by-feature structure** as a highly scalable approach.

Create a directory for each feature and place all related models, controllers, routes, and templates for that feature in that directory together.
