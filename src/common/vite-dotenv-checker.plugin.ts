import * as dotenv from "dotenv";
import * as fs from "node:fs";
import * as path from "node:path";
import { Plugin } from "vite";

export const viteDotenvChecker = (): Plugin => ({
  name: "vite-dotenv-checker",
  configResolved: async (): Promise<void> => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const environmentFilePath = path.resolve(process.cwd(), ".env");
    const environmentExampleFilePath = path.resolve(
      process.cwd(),
      ".env.example",
    );

    const environmentContent = fs.readFileSync(environmentFilePath, "utf8");
    const environmentConfig = dotenv.parse(environmentContent);

    const environmentExampleContent = fs.readFileSync(
      environmentExampleFilePath,
      "utf8",
    );
    const environmentExampleConfig = dotenv.parse(environmentExampleContent);

    for (const key in environmentExampleConfig) {
      if (!Object.prototype.hasOwnProperty.call(environmentConfig, key)) {
        throw new Error(
          `Environment variable "${key}" exists in ${environmentExampleFilePath} but not in ${environmentFilePath}`,
        );
      }
    }

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
