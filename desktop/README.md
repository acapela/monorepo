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

## Web-views architecture

We're rendering external notification previews with `BrowserView` of electron.

We also often need to show content on top of those previews (tooltips, command menu, toasts, etc).

By default window content cannot be rendered on top of BrowserView.

To workaround that, the app is not loaded directly inside main window. Instead, we load the app in `BrowserView` and then attach this view to main window and make it follow main window size.

This way, if we render any preview - we'll have 2 `BrowserView`s. One with the app, and the other with notification preview.

This way, we can call `mainWindow.setTopBrowserView(appViewOrPreviewView)` to decide what should be visible on top.

This has multiple constrains, but was the simples solution we could find:

- app view has to be transparent in area where preview is visible. This is to avoid app view covering preview if it is on top
- we need to properly manage mouse movements and focus changes to switch 'top' view so proper view can already handle first clicks.

### Important gotchas

Due to above, `mainWindow.webContents` is pretty much empty page with nothing loaded and nothing happening.

Thus a lot of behaviors are counter-intuitive, eg.

- `mainWindow.webContents.toggleDevTools()` will open devtools for empty page, instead do `getMainView(mainWindow)?.webContents.toggleDevTools()`.
- Same with many other things like `mainWindow.webContents.focus()` - this will blank page and not the actual app.
- Same goes with all the events on `mainWindow.webContents`
- Default system handler for Reload will not work (as it'll refresh `mainWindow.webContents` pretty much doing nothing). It needs to be changed to `getMainView(mainWindow)?.webContents.reload()`, etc
