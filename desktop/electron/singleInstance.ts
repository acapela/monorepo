export function initializeSingleInstanceLock() {
  /**
   * It is possible that instance lock is the reason auto-updater fails. Not sure.
   * Case: updater opens '2nd' instance before closing 1st one, and it is blocked.
   */
  // const isFirstInstance = app.requestSingleInstanceLock();
  // if (!isFirstInstance) {
  //   app.quit();
  //   return;
  // }
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // app.on("second-instance", (event, commandLine, workingDirectory) => {
  //   const { mainWindow } = appState;
  //   if (!mainWindow) {
  //     initializeMainWindow();
  //     return;
  //   }
  //   if (mainWindow.isMinimized()) {
  //     mainWindow.restore();
  //   }
  //   mainWindow.focus();
  // });
}
