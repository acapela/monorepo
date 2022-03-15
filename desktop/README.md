# desktop

## Development mode

```bash
yarn dev
```

## Build stating or production all locally

```bash
yarn build:staging
# or for production yarn build:production

# run created app
./dist-electron/mac-universal/Acapela.app/Contents/MacOS/Acapela
```

## Useful commands

### List the content of the bundled app

```bash
npx asar list ./dist-electron/mac-universal/Acapela.app/Contents/Resources/app.asar
```
