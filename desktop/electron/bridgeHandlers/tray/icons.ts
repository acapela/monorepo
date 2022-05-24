import { nativeImage } from "electron";
import { mapValues } from "lodash";

import darkIndicator from "./dark-indicator.png";
import dark from "./dark.png";
import folderLight from "./folder-light.png";
import folder from "./folder.png";
import lightIndicator from "./light-indicator.png";
import light from "./light.png";

function convertFileUrlToPath(fileUrl: string) {
  return fileUrl.replace("file://", "");
}

const rawIcons = { dark, darkIndicator, light, lightIndicator };

export const trayIcons = mapValues(rawIcons, (path) => convertFileUrlToPath(path));

const listIconsRaw = {
  folder,
  folderLight,
};

export const listIcons = mapValues(listIconsRaw, (path) => {
  return nativeImage.createFromPath(convertFileUrlToPath(path)).resize({ width: 16, height: 16, quality: "best" });
});
