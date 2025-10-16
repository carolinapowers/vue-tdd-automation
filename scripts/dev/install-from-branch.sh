#!/bin/bash

# Install vue-tdd-automation from a GitHub branch into a test app
# Usage: ./install-from-branch.sh <target-dir> [branch-name]
# - target-dir: Target directory for installation (required)
# - branch-name: GitHub branch to install from (default: main)
#
# Examples:
#   ./install-from-branch.sh ~/Repos/vue-tdd-test-app
#   ./install-from-branch.sh ~/Repos/vue-tdd-test-app main
#   ./install-from-branch.sh ~/Repos/vue-tdd-test-app refactor/directories-reorganization

set -e

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Parse arguments - target directory is required
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Target directory is required${NC}"
    echo -e "${YELLOW}Usage: $0 <target-dir> [branch-name]${NC}"
    echo -e "${YELLOW}Example: $0 ~/Repos/vue-tdd-test-app refactor/my-branch${NC}"
    exit 1
fi

TARGET_DIR=$1
BRANCH=${2:-main}
REPO="carolinapowers/vue-tdd-automation"

# Check if target directory exists before trying to cd
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${RED}❌ Error: Directory not found: ${TARGET_DIR}${NC}"
    exit 1
fi

# Resolve to absolute path
TARGET_DIR=$(cd "$TARGET_DIR" && pwd)

echo -e "${BLUE}🔄 Installing @carolinappowers/vue-tdd-automation from GitHub branch: ${YELLOW}${BRANCH}${NC}"
echo -e "${BLUE}📁 Target directory: ${YELLOW}${TARGET_DIR}${NC}\n"

# Change to target directory
cd "$TARGET_DIR"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found in ${TARGET_DIR}${NC}"
    echo -e "${RED}   Are you sure this is a Node.js project?${NC}"
    exit 1
fi

# Uninstall existing package if it exists
if npm list @carolinappowers/vue-tdd-automation &>/dev/null; then
    echo -e "${YELLOW}📦 Uninstalling existing package...${NC}"
    npm uninstall @carolinappowers/vue-tdd-automation
    echo -e "${GREEN}✓ Uninstalled${NC}\n"
else
    echo -e "${BLUE}📦 No existing package found, proceeding with fresh install...${NC}\n"
fi

# Install from GitHub branch
echo -e "${YELLOW}📥 Installing from GitHub branch: ${BRANCH}...${NC}"
GITHUB_URL="git+https://github.com/${REPO}.git#${BRANCH}"

if npm install -D "${GITHUB_URL}"; then
    echo -e "${GREEN}✓ Package installed successfully${NC}\n"
else
    echo -e "${RED}❌ Installation failed${NC}"
    exit 1
fi

# Verify installation
echo -e "${BLUE}🔍 Verifying installation...${NC}"
if [ -d "node_modules/@carolinappowers/vue-tdd-automation/dist" ]; then
    echo -e "${GREEN}✓ dist/ directory found${NC}"
    echo -e "${GREEN}✓ Package built successfully during installation${NC}\n"
else
    echo -e "${RED}❌ dist/ directory not found - package may not have built correctly${NC}"
    exit 1
fi

# Show package info
PACKAGE_VERSION=$(node -p "require('./node_modules/@carolinappowers/vue-tdd-automation/package.json').version")
echo -e "${BLUE}📦 Installed version: ${GREEN}${PACKAGE_VERSION}${NC}"
echo -e "${BLUE}📦 Branch: ${GREEN}${BRANCH}${NC}\n"

# Ask if user wants to run init --force
echo -e "${YELLOW}Would you like to run 'npx vue-tdd init --force' to update templates? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo -e "\n${BLUE}🚀 Running npx vue-tdd init --force...${NC}\n"
    npx vue-tdd init --force
    echo -e "\n${GREEN}✅ Templates updated!${NC}"
else
    echo -e "\n${BLUE}ℹ️  Skipped template update. Run manually with: npx vue-tdd init --force${NC}"
fi

echo -e "\n${GREEN}🎉 Done!${NC}"
echo -e "${BLUE}You can now test the package from the '${BRANCH}' branch${NC}\n"
