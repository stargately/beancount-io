import * as fs from "fs";
import * as path from "path";

/**
 * Bumps the version in app.json using the format 1.date.buildNumber
 * - date: current date in format YYYYMMDD
 * - buildNumber: incremented by 1, or 0 if not exists
 * - versionCode: same as buildNumber
 */
function bumpVersion() {
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

  // Create Android changelog file
  const androidChangelogDir = path.resolve(
    process.cwd(),
    "fastlane/metadata/android/en-US/changelogs",
  );
  const androidChangelogPath = path.resolve(
    androidChangelogDir,
    `${buildNumber}.txt`,
  );

  // Create iOS release notes file
  const iosReleaseNotesPath = path.resolve(
    process.cwd(),
    "fastlane/metadata/en-US/release_notes.txt",
  );

  // Ensure directories exist
  if (!fs.existsSync(androidChangelogDir)) {
    fs.mkdirSync(androidChangelogDir, { recursive: true });
  }

  // Create template content
  const templateContent = `What's New in Version ${newVersion}:

• [Add your changes here]
• [Add your changes here]
• [Add your changes here]
`;

  // Create Android changelog file if it doesn't exist
  if (!fs.existsSync(androidChangelogPath)) {
    fs.writeFileSync(androidChangelogPath, templateContent);
    console.log(`Created Android changelog file at ${androidChangelogPath}`);
  }

  // Update iOS release notes
  fs.writeFileSync(iosReleaseNotesPath, templateContent);
  console.log(`Updated iOS release notes at ${iosReleaseNotesPath}`);

  console.log(`Version bumped to ${newVersion}`);
  console.log(`iOS build number: ${appJson.expo.ios?.buildNumber}`);
  console.log(`Android version code: ${appJson.expo.android?.versionCode}`);
  console.log(`⚠️  REMINDER: Don't forget to update the changelog content in:
  - fastlane/metadata/android/en-US/changelogs/${buildNumber}.txt
  - fastlane/metadata/en-US/release_notes.txt`);
}

// Execute the function
bumpVersion();
