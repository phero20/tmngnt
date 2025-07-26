export default [
    {
        files: ["**/*.ts"],
        ignores: ["dist/**"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            "no-unused-vars": "error",
            "no-console": "warn",
            "eqeqeq": "error",
        },
    },
];
