#!/bin/bash
# Render build script for installing Python dependencies

echo "🚀 Starting build process..."

# Install npm dependencies first
echo "📦 Installing npm dependencies..."
npm install
INSTALL_RESULT=$?
if [ $INSTALL_RESULT -ne 0 ]; then
  echo "❌ npm install failed with exit code $INSTALL_RESULT"
  exit $INSTALL_RESULT
fi

# Check if Python and pip are available
if command -v python3 &> /dev/null; then
  echo "🐍 Found python3, installing yt-dlp..."
  pip install yt-dlp
  echo "✅ yt-dlp installation completed"
elif command -v python &> /dev/null; then
  echo "🐍 Found python, installing yt-dlp..."
  pip install yt-dlp
  echo "✅ yt-dlp installation completed"
else
  echo "⚠️ Warning: Python not found. Using npm yt-dlp package..."
fi

echo "🎉 Build process finished successfully"
exit 0