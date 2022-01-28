let releaseVersion = process.env.RELEASE_VERSION || "";
if (releaseVersion.startsWith("refs/tags/")) releaseVersion = releaseVersion.replace(/^refs\/tags\//, "");
if (releaseVersion.startsWith("v")) releaseVersion = releaseVersion.slice(1);
module.exports = releaseVersion;
