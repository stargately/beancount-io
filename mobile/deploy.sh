#! /usr/bin/env bash

# https://docs.expo.dev/build/introduction/

set -e # exit on error

# Install dependencies
yarn

# 1. Install npx eas-cli@latest CLI if not already installed
yarn global add eas-cli@latest

# No need for login; EAS_TOKEN will be used automatically by the CLI if set
# export EAS_TOKEN=your-token # <-- make sure this is set in your CI or shell environment

# 2. Send Over-the-Air Updates ####
npx eas-cli@latest update --channel production --message "Production update $(date +'%Y-%m-%d %H:%M:%S')"

# --------------------------------------------------
# iOS
# --------------------------------------------------


# 3. Build iOS App ####
echo "Building iOS app..."
npx eas-cli@latest build --platform ios --profile production --non-interactive --no-wait

# 4. Submit iOS App ####
echo "Submitting iOS app to App Store..."
npx eas-cli@latest submit --platform ios --latest --non-interactive

# --------------------------------------------------
# android
# --------------------------------------------------


# 5. Build Android App ####
echo "Building Android app..."
npx eas-cli@latest build --platform android --profile production --non-interactive --no-wait

# 6. Submit Android App ####
echo "Submitting Android app to Play Store..."
npx eas-cli@latest submit --platform android --latest --non-interactive
