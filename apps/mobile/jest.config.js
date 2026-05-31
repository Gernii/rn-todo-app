module.exports = {
	preset: "jest-expo",
	setupFilesAfterEnv: ["./test-setup.js"],
	// Tell Jest which libraries to transpile before running tests
	transformIgnorePatterns: [
		"node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@rn-primitives/.*)",
	],
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.d.ts",
		"!src/**/index.{ts,tsx}",
		"!src/shared/ui/**/*.{ts,tsx}",
		"!src/app/**/*.{ts,tsx}",
		"!src/pages/**/ui/page.{ts,tsx}",
	],
	coverageThreshold: {
		global: {
			statements: 80,
			branches: 80,
			functions: 80,
			lines: 80,
		},
	},
};
