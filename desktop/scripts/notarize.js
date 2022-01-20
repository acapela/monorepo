/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const electronNotarize = require("electron-notarize");

module.exports = async function (params) {
  if (process.platform !== "darwin") {
    return;
  }
  let appId = "com.desktop.acapela";

  let appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
  if (!fs.existsSync(appPath)) {
    console.info(`skip notarizing: ${appPath} does not exist`);
    return;
  }

  console.info(`Notarizing ${appId} found at ${appPath} with Apple ID ${process.env.APPLE_ID}`);

  try {
    await electronNotarize.notarize({
      tool: "notarytool",
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });
  } catch (error) {
    console.error(error);
  }

  console.info(`Done notarizing ${appId}`);
};
