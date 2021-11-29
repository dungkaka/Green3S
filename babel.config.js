module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            "react-native-reanimated/plugin",
            [
                "module-resolver",
                {
                    extensions: [".js", ".jsx", ".ts", ".tsx", ".android.js", ".android.tsx", ".ios.js", ".ios.tsx"],
                    root: ["./src"],
                    alias: {
                        "@configs": "./src/configs",
                        "@theme": "./src/theme",

                        "@hooks": "./src/utils/hooks",
                        "@utils": "./src/utils",

                        "@common-ui": "./src/lib",
                        "@common-components": "./src/components/common",
                        "@components": "./src/components",

                        "@images": "./src/public/assets/images",

                        "@services": "./src/services",

                        "@redux": "./src/redux",

                        "@navigation": "./src/navigation",

                        "@assets": "./src/assets",
                    },
                },
            ],
        ],
    };
};
