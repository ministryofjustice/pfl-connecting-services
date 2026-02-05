# Tests Directory

This directory contains unit tests for the Connecting Services server code.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- server/__tests__/path/to/test.ts
```

## Test Utilities

Shared test utilities are located in `server/test-utils/`:

- **testMocks.ts** - Mock objects for testing
- **testAppSetup.ts** - Express app setup for integration tests

## Best Practices

1. **Test Organization**: Group related tests in appropriate directories
2. **Test Data**: Use realistic test data that covers edge cases
3. **Naming**: Follow the pattern `*.test.ts` for test files
4. **Assertions**: Use Jest's built-in matchers
5. **Mocking**: Use the shared mocks from testMocks.ts when possible

## Adding New Tests

When adding new tests:

1. Create a test file with the `.test.ts` extension
2. Import the necessary test utilities
3. Follow the existing test patterns for consistency
4. Test various data scenarios including edge cases
5. Run tests locally before committing
