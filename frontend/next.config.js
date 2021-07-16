process.env.APP = "frontend";
process.env.NEXT_PUBLIC_STAGE = process.env.STAGE;
process.env.NEXT_PUBLIC_SENTRY_RELEASE = process.env.SENTRY_RELEASE;
/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require("next-compose-plugins");
const bundleAnalyzer = require("@next/bundle-analyzer");
const withTranspileModules = require("next-transpile-modules");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

const ENV_VARIABLES_PATH = path.resolve(__dirname, "..", ".env");

/**
 * Let's tell next.js to compile TypeScript files from other packages of monorepo.
 * eg. `frontend/node_modules/~some-acapela-package/file.ts` will be compiled the same way as any other ts file
 * included directly in frontend.
 *
 * This allows us to have hot-reloading experience of other packages working the same as with frontend files itself.
 */
const createTsPackagesPlugin = () => {
  // We'll read all dependencies starting with `~` and tell next.js to transpile them.

  // Load and parse package.json file content as json
  const packageJsonPath = path.resolve(__dirname, "package.json");
  const packageJsonRawContent = fs.readFileSync(packageJsonPath);
  const packageInfo = JSON.parse(packageJsonRawContent);

  // Get all dependencies and dev dependencies
  const dependenciesMap = { ...packageInfo.dependencies, ...packageInfo.devDependencies };

  // Filter dependencies names to leave only starting with `~`
  const monorepoDependencies = Object.keys(dependenciesMap).filter((dependencyName) => dependencyName.startsWith("~"));

  // Return plugin that will transpile those dependencies using default next.js config
  return withTranspileModules([
    ...monorepoDependencies,
    // Add this package itself too to allow ~frontend imports inside this package
    packageInfo.name,
  ]);
};

function getEnvVariables(envFilePath) {
  if (!fs.existsSync(envFilePath)) {
    console.warn(`Not able to load .env file path provided in next.config.js envVariables plugin`);
    return {};
  }

  const fileStats = fs.statSync(envFilePath);

  if (!fileStats.isFile()) {
    console.warn(`.env file path provided in next.config.js is not a file.`);
    return {};
  }

  // Read and parse .env file from provided path
  const envFileRawContent = fs.readFileSync(envFilePath);
  const allEnvVariablesMap = dotenv.parse(envFileRawContent);

  return allEnvVariablesMap;
}

function filterClientSideEnvVars(allEnvVariablesMap) {
  const allEnvVariableNames = Object.keys(allEnvVariablesMap);
  const clientSideEnvVarNames = allEnvVariableNames.filter((varName) => varName.startsWith("NEXT_PUBLIC_"));

  const clientSideEvnVarsMap = {};

  clientSideEnvVarNames.forEach((envVarName) => {
    clientSideEvnVarsMap[envVarName] = allEnvVariablesMap[envVarName];
  });

  return clientSideEvnVarsMap;
}

function getEsBuildEnvVarsDefine(envVariablesMap) {
  const defineVariablesMap = {};

  Object.keys(envVariablesMap).forEach((variableName) => {
    defineVariablesMap[`process.env.${variableName}`] = JSON.stringify(envVariablesMap[variableName]);
  });

  return defineVariablesMap;
}

const esbuildMode = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack: (config, options) => {
      const isServer = options.isServer;

      const terserIndex = config.optimization.minimizer.findIndex(
        (minimizer) => minimizer.constructor.name === "TerserPlugin"
      );
      if (terserIndex > -1) {
        config.optimization.minimizer.splice(terserIndex, 1, new ESBuildMinifyPlugin(options));
      }

      const jsLoader = config.module.rules.find((rule) => rule.test && rule.test.test(".tsx"));

      // config.module.rules.forEach(console.log);

      const allEnvVariables = getEnvVariables(ENV_VARIABLES_PATH);

      const avaliableEnvVariables = isServer ? allEnvVariables : filterClientSideEnvVars(allEnvVariables);

      if (jsLoader) {
        jsLoader.use.loader = "esbuild-loader";
        jsLoader.use.options = {
          // Specify `tsx` if you're using TypeSCript
          loader: "tsx",
          target: "es2017",
          define: getEsBuildEnvVarsDefine(avaliableEnvVariables),
        };
      }

      config.plugins.push(
        new options.webpack.ProvidePlugin({
          React: "react",
        })
      );

      return config;
    },
  });
};

module.exports = withPlugins(
  [
    //
    [esbuildMode, {}],
    //
    [
      bundleAnalyzer,
      {
        enabled: process.env.ANALYZE === "true",
      },
    ],
    //
    createTsPackagesPlugin(),
  ],
  {
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    eslint: {
      // Warning: Dangerously allow production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    webpack5: true,

    generateBuildId: async () => {
      return process.env.BUILD_ID || "dev-build";
    },

    async rewrites() {
      return [
        {
          source: "/api/backend/:path*",
          destination: `http://localhost:1337/api/:path*`,
        },
        {
          source: "/graphql",
          destination: `http://localhost:8080/v1/graphql`,
        },
      ];
    },
  }
);
