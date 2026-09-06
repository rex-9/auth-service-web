#!/usr/bin/env bash

# ==============================================================================
# Rexone Web — Unit Test Runner (Vitest)
#
# Usage:
#   ./scripts/test_unit.sh [filter] [options]
#
# Examples:
#   ./scripts/test_unit.sh               # Run all unit tests
#   ./scripts/test_unit.sh auth          # Run auth controller / unit tests
#   ./scripts/test_unit.sh --coverage    # Run with coverage report
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

echo "===================================================="
echo " ⚡ Rexone Web — Unit Tests (Vitest)"
echo "===================================================="

npx vitest run "$@"
