## Acapela Monorepo

Docs for workspaces:

[Backend README](./backend/README.md)

[Frontend README](./backend/README.md)

## Monorepo setup

This repo is based on npm workspaces (https://docs.npmjs.com/cli/v7/using-npm/workspaces).

### Dictionary

**Package** - single, npm-based part of this repo eg `frontend` and `backend`.

**Shared dependency** - Dependency which is used in the same version in every package.

### Shared dependencies

It is possible that the same dependency (eg `lodash`) is used across multiple packages using the same version.

In such case, dependency is added to root `package.json` (using `npm install package -S or -D`) at root folder and then added as `peer dependency` to packages using it with version `*`.

For example:

Let's say we want to use `react` version `17.0.0` in every package.

Root `package.json`

```json
  "dependencies": {
    "react": "^17.0.0"
  }
```

And then `frontend/package.json`

```json
  "peerDependencies": {
    "react": "*"
  }
```

### Versioning

Version of single packages (such as frontend or backend) should never be changed.

Version of root package can be freely changed if it makes sense for any use-case.

### Using one package inside another package.

Each package can import content of other package.

To do it, it needs to define package as its dependency

eg.

`utils/package.json`

```json
{
  "name": "@acapela/utils",
  "version": "0.1.0"
}
```

and then `frontend/package.json`

```json
{
  "dependencies": {
    "@acapela/utils": "0.1.0"
  }
}
```

In such setup, after calling `npm install` - **symlink** will be created, meaning `./frontend/node_modules/@acapela/utils` is symlink to `./utils` (not clone!).

It also means that each change made inside `./utils` would be instantly reflected inside `./frontend/node_modules/@acapela/utils`.

### Running scripts

It is possible to run scripts of every package from root folder of this repo.

run `npm start` at root level to see possible scripts helper:

![NPM START](./docs/npm-start.gif)

### Running commands in scope of single package

If you want to manually run any command in scope of package.

Those scripts are equal:

```bash
npm run frontend -- add react -S
```

It will be equal to

```bash
cd frontend
npm add react -S
```

Other examples might be `npm run backend -- run test:watch` etc.

## Shared configuration

### tsconfig

There is root level `tsconfig.json` file which is extended and modified if needed inside `<package>/tsconfig.json`

### eslint

Eslint config is in the root level and is used as-is in every package.

### gitignore

There is generic, node-based `.gitignore` at root level, but each package has its own `.gitignore`. Root one is kind of a backup.

### prettier

Prettier config is defined at root level and is used as-is in every package.
