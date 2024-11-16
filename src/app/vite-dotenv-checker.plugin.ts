import * as dotenv from "dotenv";
import * as fs from "node:fs";
import path from "node:path";
import { Plugin } from "vite";

// Vite plugin to check consistency between .env and .env.example files
export const viteDotenvChecker = (): Plugin => ({
  name: "vite-dotenv-checker",

  // Check environment variables on configuration resolution
  configResolved: async (): Promise<void> => {
    if (process.env.NODE_ENV === "production") {
      return; // Skip check in production environment
    }

    const environmentFilePath = path.resolve(process.cwd(), ".env");
    const environmentExampleFilePath = path.resolve(
      process.cwd(),
      ".env.example",
    );

    // Read and parse environment files
    const environmentContent = fs.readFileSync(environmentFilePath, "utf8");
    const environmentConfig = dotenv.parse(environmentContent);

    const environmentExampleContent = fs.readFileSync(
      environmentExampleFilePath,
      "utf8",
    );
    const environmentExampleConfig = dotenv.parse(environmentExampleContent);

    // Check if all variables in .env.example exist in .env
    for (const key in environmentExampleConfig) {
      if (!Object.prototype.hasOwnProperty.call(environmentConfig, key)) {
        throw new Error(
          `Environment variable "${key}" exists in ${environmentExampleFilePath} but not in ${environmentFilePath}`,
        );
      }
    }

    // Check if all variables in .env exist in .env.example
    for (const key in environmentConfig) {
      if (
        !Object.prototype.hasOwnProperty.call(environmentExampleConfig, key)
      ) {
        throw new Error(
          `Environment variable "${key}" exists in ${environmentFilePath} but not in ${environmentExampleFilePath}`,
        );
      }
    }

    console.log("✅  .env and .env.example files are consistent");
  },
});
