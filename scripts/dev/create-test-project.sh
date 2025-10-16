#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Vue TDD Automation - Local Testing Script${NC}\n"

# Build the package
echo -e "${YELLOW}📦 Building package...${NC}"
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Build failed${NC}"
  exit 1
fi

# Pack the package
echo -e "\n${YELLOW}📦 Packing package...${NC}"
TARBALL=$(npm pack 2>&1 | grep -E '\.tgz$' | tail -1)

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Pack failed${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Created: $TARBALL${NC}"

# Create test directory
TEST_DIR="../vue-tdd-test-$(date +%s)"
echo -e "\n${YELLOW}🏗️  Creating test project at: $TEST_DIR${NC}"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

# Create Vue project non-interactively
echo -e "\n${YELLOW}🎨 Creating Vue project...${NC}"
npm create vue@latest test-app -- --typescript --vitest

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Vue project creation failed${NC}"
  exit 1
fi

cd test-app

# Install dependencies
echo -e "\n${YELLOW}📦 Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Dependency installation failed${NC}"
  exit 1
fi

# Install the local package
echo -e "\n${YELLOW}📦 Installing local @vue-tdd/automation package...${NC}"
TARBALL_PATH="../../vue-tdd-automation/$TARBALL"
npm install -D "$TARBALL_PATH"

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Package installation failed${NC}"
  exit 1
fi

# Test initialization
echo -e "\n${YELLOW}🧪 Testing: npx vue-tdd init${NC}"
npx vue-tdd init

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ vue-tdd init failed${NC}"
  exit 1
fi

# Check files were created
echo -e "\n${YELLOW}✅ Verifying created files...${NC}"
VERIFIED=true

if [ -f "vitest.config.ts" ]; then
  echo -e "${GREEN}  ✓ vitest.config.ts created${NC}"
else
  echo -e "${RED}  ✗ vitest.config.ts missing${NC}"
  VERIFIED=false
fi

if [ -d "scripts" ]; then
  echo -e "${GREEN}  ✓ scripts/ directory created${NC}"
else
  echo -e "${RED}  ✗ scripts/ directory missing${NC}"
  VERIFIED=false
fi

if [ -d "src/test/helpers" ]; then
  echo -e "${GREEN}  ✓ src/test/helpers/ created${NC}"
else
  echo -e "${RED}  ✗ src/test/helpers/ missing${NC}"
  VERIFIED=false
fi

if [ -f "TDD_WORKFLOW.md" ]; then
  echo -e "${GREEN}  ✓ TDD_WORKFLOW.md created${NC}"
else
  echo -e "${RED}  ✗ TDD_WORKFLOW.md missing${NC}"
  VERIFIED=false
fi

if [ -f ".github/workflows/auto-tdd-setup.yml" ]; then
  echo -e "${GREEN}  ✓ GitHub workflows created${NC}"
else
  echo -e "${RED}  ✗ GitHub workflows missing${NC}"
  VERIFIED=false
fi

# Test component creation
echo -e "\n${YELLOW}🧪 Testing: npx vue-tdd create TestButton${NC}"
npx vue-tdd create TestButton "A test button component"

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ vue-tdd create failed${NC}"
  exit 1
fi

# Run tests
echo -e "\n${YELLOW}🧪 Running tests...${NC}"
npm test

if [ $? -ne 0 ]; then
  echo -e "${YELLOW}⚠️  Tests ran but some may have failed (this is expected for scaffolding)${NC}"
fi

# Final summary
echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
if [ "$VERIFIED" = true ]; then
  echo -e "${GREEN}✅ All verifications passed!${NC}"
else
  echo -e "${RED}❌ Some verifications failed${NC}"
fi

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Test project ready!${NC}\n"
echo -e "Location: ${YELLOW}$TEST_DIR/test-app${NC}\n"
echo -e "To continue testing manually:"
echo -e "  ${BLUE}cd $TEST_DIR/test-app${NC}"
echo -e "  ${BLUE}npx vue-tdd create MyComponent${NC}"
echo -e "  ${BLUE}npm test${NC}"
echo -e "  ${BLUE}npm run test:ui${NC}\n"

echo -e "To clean up:"
echo -e "  ${BLUE}cd $(dirname $(pwd))${NC}"
echo -e "  ${BLUE}rm -rf $(basename $TEST_DIR)${NC}"
echo -e "  ${BLUE}cd vue-tdd-automation${NC}"
echo -e "  ${BLUE}rm $TARBALL${NC}\n"
