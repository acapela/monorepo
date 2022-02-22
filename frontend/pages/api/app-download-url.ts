import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const LATEST_URL = `https://github.com/weareacapela/releases/releases/latest`;

/**
 * Github can redirect /latest release to an actual version.
 *
 * Due to CORS-policy, we need to do that server-side.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Fetching latest release page will redirect us to exact version which is actually latest
  const response = await axios.get(LATEST_URL);

  /**
   * Will be like https://github.com/weareacapela/releases/releases/tag/v4.24.0
   * we need      https://github.com/weareacapela/releases/releases/download/v4.24.0/Acapela-4.24.0-universal-mac.zip
   *
   */
  const versionReleaseUrl = response.request.res.responseUrl as string;

  const version = versionReleaseUrl.split("/").pop()?.replace("v", "") ?? "";

  const downloadURL = versionReleaseUrl.replace("/tag/", "/download/") + `/Acapela-${version}-universal.dmg`;

  res.send({
    downloadURL,
  });
}
