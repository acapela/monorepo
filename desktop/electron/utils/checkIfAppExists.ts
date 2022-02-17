import { execSync } from "child_process";
import { existsSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

function ensureDefaultAppExistScript() {
  const scriptPath = join(tmpdir(), "defaultAppExist.sh");
  if (!existsSync(scriptPath)) {
    writeFileSync(scriptPath, appleScript, { mode: 0o755 });
  }
  return scriptPath;
}

export async function checkIfAppExists(protocol: string) {
  const res = execSync(`${ensureDefaultAppExistScript()} "${protocol}://test"`, { timeout: 60000 });
  return res.toString().trim() === "true";
}

// Imported from https://github.com/Shubham-Kumar-2000/protocol-registry
// Licence MIT
// https://github.com/Shubham-Kumar-2000/protocol-registry/blob/05eab30aaa21f59be36f3bf93f6dbf3d9b06ff54/src/macos/defaultAppExist.sh
const appleScript = `#!/usr/bin/osascript

use AppleScript version "2.4"
use framework "Foundation"
use framework "AppKit"

on run argv
    set appFile to my getDefautltAppFor(item 1 of argv)

    if appFile = missing value then
        set output to "false"
    else
        set output to "true"
    end if

    output
end run

on getDefautltAppFor(theProto)
\tset theWorkspace to current application's NSWorkspace's sharedWorkspace()
\tset defaultAppURL to theWorkspace's URLForApplicationToOpenURL:(current application's |NSURL|'s URLWithString:theProto)
\tif defaultAppURL = missing value then return missing value -- or false
\treturn defaultAppURL as «class furl»
end getDefautltAppFor
`;
