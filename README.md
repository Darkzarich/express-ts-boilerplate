Boilerplate/template repository for starting an `Express 5 + TypeScript + Jest` (with [supertest](https://github.com/forwardemail/supertest)) project.

To create a repository based on this template, simply click the "Use this template" button above.

### Requirements

- Node.js 22 or newer (see `.nvmrc`, run `nvm use` to switch)

### Scripts

| Command                   | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| `npm run start:dev`       | Run the app from TypeScript sources with `tsx`        |
| `npm run start:dev:watch` | Same as above, restarting on file changes             |
| `npm run build`           | Compile to `dist/`                                    |
| `npm start`               | Run the compiled app from `dist/`                     |
| `npm test`                | Run tests with Jest                                   |
| `npm run lint:types`      | Type-check app and test sources                       |

The port can be set with the `PORT` environment variable (defaults to `3000`).

Tests are transpiled with [`@swc/jest`](https://github.com/swc-project/pkgs/tree/main/packages/jest) without type checking, so run `npm run lint:types` (e.g. in CI) to catch type errors.

### Precautions

It uses a **folder-by-type structure**, which is suitable for **small projects** (~10 files in each type).

As your project grows it will become more difficult to find the file you're actually looking for.

If you intend to build a large project I'd highly recommend using a **folder-by-feature structure** as a highly scalable approach.

Create a directory for each feature and place all related models, controllers, routes, and templates for that feature in that directory together.
