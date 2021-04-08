#!/bin/bash

set -euo pipefail

# this merges all dependencies from all packages in the workspace
jq -rs '(.[0] * .[1] * .[2] * .[3] * .[4] * .[5]).dependencies | to_entries | map([.key, .value] | join("@")) | join("\n")' package.json ../package.json ../ui/package.json ../shared/package.json ../db/package.json ../config/package.json |
grep -v '@acapela'
