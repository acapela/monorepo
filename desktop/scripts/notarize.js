import fs from "fs";
import path from "path";

import { electron_notarize } from "electron-notarize";

module.exports = async function (params) {
  if (process.platform !== "darwin") {
    return;
  }

  console.info("afterSign hook triggered", params);

  let appId = "com.desktop.acapela";

  let appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
  if (!fs.existsSync(appPath)) {
    console.info("skip");
    return;
  }

  console.info(`Notarizing ${appId} found at ${appPath} with Apple ID ${process.env.APPLE_ID}`);

  try {
    await electron_notarize.notarize({
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
    });
  } catch (error) {
    console.error(error);
  }

  console.info(`Done notarizing ${appId}`);
};
