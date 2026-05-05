#!/usr/bin/env bash

# Abort on errors
set -e

echo "Starting deployment process..."

# Build the project
echo "Building the React project..."
npm run build

# Navigate into the build output directory
cd dist

# Place a .nojekyll to bypass GitHub Pages' Jekyll processing
echo > .nojekyll

# If you are deploying to a custom domain
# echo 'www.example.com' > CNAME

echo "Initializing git repository in dist folder..."
git init
git checkout -B main
git add -A
git commit -m 'deploy'

echo "Deployment commit created."

# IMPORTANT: Uncomment the line below and replace the URL with your repository!
# If you are deploying to https://<USERNAME>.github.io/<REPO>
# echo "Pushing to gh-pages branch..."
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

# If you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

cd -

echo "Deployment script finished! (Make sure to uncomment the git push lines if deploying to GitHub Pages)"
