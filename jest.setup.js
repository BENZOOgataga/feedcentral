// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Silence noisy console.error output during tests by default.
// Tests can still assert console.error calls by spying/restoring locally.
beforeAll(() => {
	// Replace console.error with a no-op to keep test output clean.
	// We keep the Jest spy so individual tests can call mockRestore() or
	// use jest.spyOn(console, 'error') themselves to make assertions.
	if (typeof jest !== 'undefined' && typeof jest.spyOn === 'function') {
		jest.spyOn(console, 'error').mockImplementation(() => {});
	}
});

afterAll(() => {
	// Restore console.error to its original implementation after tests.
	try {
		if (console.error && typeof console.error.mockRestore === 'function') {
			console.error.mockRestore();
		}
	} catch (e) {
		// ignore
	}
});
