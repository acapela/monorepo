process.env.APP = "frontend";
process.env.NEXT_PUBLIC_STAGE = process.env.STAGE;
/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require("next-compose-plugins");
const bundleAnalyzer = require("@next/bundle-analyzer");
const withTranspileModules = require("next-transpile-modules");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

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

/**
 * This plugin allows passing variables from .env file into server/client runtime using process.env.VAR_NAME.
 *
 * By default next.js is handling it, but it requires .env file to be present in the root folder of
 * next project.
 *
 * As we're using monorepo and sharing env vars between frontend and backend, I've created plugin
 * that does the same thing, but allows passing path to .env file (in our case it sits at monorepo root)
 */
const envVariables = (nextConfig = {}) => {
  function isEmpty(input) {
    return input === null || input === undefined;
  }

  return Object.assign({}, nextConfig, {
    webpack: (config, options) => {
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }
      // This function is called twice, once for server side and once for client side webpack.
      const isServer = options.isServer;
      const envFilePath = options.config.envFilePath;

      if (!fs.existsSync(envFilePath)) {
        console.warn(`Not able to load .env file path provided in next.config.js envVariables plugin`);
        return config;
      }

      const fileStats = fs.statSync(envFilePath);

      if (!fileStats.isFile()) {
        console.warn(`.env file path provided in next.config.js is not a file.`);
        return config;
      }

      // Read and parse .env file from provided path
      const envFileRawContent = fs.readFileSync(envFilePath);
      const allEnvVariablesMap = dotenv.parse(envFileRawContent);

      // Prepare list of var names.
      // Note: On frontend, only vars prefixed with NEXT_PUBLIC_ will be avaliable. (this follows official docs)
      const allEnvVariableNames = Object.keys(allEnvVariablesMap);
      const clientSideEnvVarNames = allEnvVariableNames.filter((varName) => varName.startsWith("NEXT_PUBLIC_"));

      // Populate node process env variables from parsed file so webpack plugin will 'see' those vars.
      allEnvVariableNames.forEach((varName) => {
        if (isEmpty(process.env[varName])) {
          process.env[varName] = allEnvVariablesMap[varName];
        }
      });

      const webpack = require("webpack");

      // Depending on client/server side, allow proper set of vars to be accessable.
      if (isServer) {
        config.plugins.push(new webpack.EnvironmentPlugin(allEnvVariableNames));

        return config;
      }

      config.plugins.push(new webpack.EnvironmentPlugin(clientSideEnvVarNames));

      return config;
    },
  });
};

module.exports = withPlugins(
  [
    //
    [
      bundleAnalyzer,
      {
        enabled: process.env.ANALYZE === "true",
      },
    ],
    //
    [
      envVariables,
      {
        envFilePath: path.resolve(__dirname, "..", ".env"),
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
