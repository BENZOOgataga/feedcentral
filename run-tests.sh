#!/bin/bash
# Quick Test Reference for FeedCentral API Tests

echo "🧪 FeedCentral API Test Suite"
echo "=============================="
echo ""

# Check if Jest is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js"
    exit 1
fi

show_help() {
    echo "Available commands:"
    echo ""
    echo "  npm test                    # Run all tests"
    echo "  npm test:watch              # Watch mode for development"
    echo "  npm test:coverage           # Generate coverage report"
    echo "  npm test:ci                 # CI mode with coverage"
    echo ""
    echo "Specific test files:"
    echo ""
    echo "  npm test articles.test      # Main feed tests"
    echo "  npm test auth.test          # Authentication tests"
    echo "  npm test user-sources.test  # Custom sources tests"
    echo "  npm test integration.test   # Integration tests"
    echo ""
    echo "Filtering tests:"
    echo ""
    echo "  npm test -- --testNamePattern=\"should return\"  # Match test names"
    echo "  npm test -- articles.test                       # Specific file"
    echo ""
    echo "Coverage:"
    echo ""
    echo "  npm test:coverage           # Full coverage report"
    echo "  open coverage/lcov-report/index.html  # View HTML report"
    echo ""
}

case "${1}" in
    help|-h|--help)
        show_help
        ;;
    list)
        echo "📋 Test Files:"
        npx jest --listTests | sed 's/.*tests\//  - tests\//'
        ;;
    quick)
        echo "🚀 Running quick test (first 10 tests)..."
        npx jest --maxWorkers=2 --bail --verbose 2>&1 | head -50
        ;;
    *)
        show_help
        ;;
esac
