#!/bin/bash

set -euo pipefail

jq -rs '(.[0] * .[1]).dependencies | to_entries | map([.key, .value] | join("@")) | join("\n")' ../package.json package.json |
grep -v '@acapela'
