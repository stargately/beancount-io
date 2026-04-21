import * as fs from "fs";
import * as path from "path";

/**
 * Bumps the version in app.json using the format 1.date.buildNumber
 * WITHOUT updating changelog content (dummy bump)
 * - date: current date in format YYYYMMDD
 * - buildNumber: incremented by 1, or 0 if not exists
 * - versionCode: same as buildNumber
 */
function bumpVersionDummy() {
  // Get the current date in YYYYMMDD format
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  // Read the app.json file
  const appJsonPath = path.resolve(process.cwd(), "app.json");
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));

  // Parse the current version
  const currentVersion = appJson.expo.version || "1.0.0";
  const versionParts = currentVersion.split(".");

  // Get the current build number
  let buildNumber = 0;
  if (versionParts.length >= 3) {
    buildNumber = parseInt(versionParts[2], 10) || 0;
  }

  // Increment build number
  buildNumber += 1;

  // Create the new version string
  const newVersion = `1.${dateStr}.${buildNumber}`;

  // Update the version in app.json
  appJson.expo.version = newVersion;

  // Update iOS build number
  if (appJson.expo.ios) {
    appJson.expo.ios.buildNumber = String(buildNumber);
  }

  // Update Android version code
  if (appJson.expo.android) {
    appJson.expo.android.versionCode = buildNumber;
  }

  // Update package.json version
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`Updated version in package.json to ${newVersion}`);
  }

  // Write the updated app.json file
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));

  console.log(
    `Version bumped to ${newVersion} (dummy bump - no changelog changes)`,
  );
  console.log(`iOS build number: ${appJson.expo.ios?.buildNumber}`);
  console.log(`Android version code: ${appJson.expo.android?.versionCode}`);
}

// Execute the function
bumpVersionDummy();
