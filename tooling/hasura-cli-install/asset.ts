import axios from "axios";
import fs from "fs";
import path from "path";

interface DownloadOptions {
  url: string;
  destDir: string;
  fileName: string;
}

export async function download({ url, destDir, fileName }: DownloadOptions): Promise<string> {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }
  const dest = path.resolve(destDir, fileName);
  const writer = fs.createWriteStream(dest);

  const res = await axios.get(url, {
    responseType: "stream",
    headers: {
      Accept: "application/octet-stream",
      "User-Agent": "hasura-cli",
    },
  });

  res.data.pipe(writer);

  return new Promise((resolve, reject): void => {
    writer.on("finish", (): void => {
      fs.chmodSync(dest, "777");
      resolve(dest);
    });
    writer.on("error", reject);
  });
}

export async function getUrl(
  tag: string, // e.g. "v1.0.0-beta.6" or "v1.0.0-alpha29"
  platform: string = process.platform
): Promise<string> {
  const prefix = tag.slice(0, -1).endsWith("alpha0") && parseInt(tag.slice(-1), 10) < 5 ? "" : "cli-";
  // Asset name
  //   * From v1.0.0-alpha01 to v1.0.0-alpha04,
  //     * hasura-linux-amd64
  //     * hasura-darwin-amd64
  //     * hasura-windows-amd64.exe
  //   * From v1.0.0-alpha05 and higher
  //     * cli-hasura-linux-amd64
  //     * cli-hasura-darwin-amd64
  //     * cli-hasura-windows-amd64.exe
  const asset = `${prefix}hasura-${platform === "win32" ? "windows" : platform}-amd64${
    platform === "win32" ? ".exe" : ""
  }`;

  return `https://github.com/hasura/graphql-engine/releases/download/${tag}/${asset}`;
}
