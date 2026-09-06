#!/usr/bin/env bash

# ==============================================================================
# Rexone Web — Full Test Suite Runner (Unit + E2E)
#
# Usage:
#   ./scripts/test.sh [flow|file] [options]
#
# Examples:
#   ./scripts/test.sh                     # Run unit tests, then all E2E flows
#   ./scripts/test.sh sign-in             # Run unit tests, then sign-in E2E
#
# Note:
#   To run ONLY Unit tests:
#     ./scripts/test_unit.sh
#   To run ONLY E2E tests:
#     ./scripts/test_e2e.sh
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

echo "===================================================="
echo " 🧪 Rexone Web — Running Full Test Suite"
echo " (Unit + E2E)"
echo "===================================================="

# 1. Run Unit tests
"$SCRIPT_DIR/test_unit.sh"

# 2. Run E2E tests
"$SCRIPT_DIR/test_e2e.sh" "$@"
