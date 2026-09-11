#!/usr/bin/env bash

# ==============================================================================
# Rexone Web — Architecture Contract Check
#
# Usage:
#   ./scripts/check_architecture.sh
#
# Enforces the mechanically verifiable Web rules from LAW.md.
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"
node "$SCRIPT_DIR/check_architecture.mjs"
