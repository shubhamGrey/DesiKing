#!/bin/bash
# Install Chrome and dependencies on Ubuntu server for PuppeteerSharp

echo "Installing Chrome and dependencies for PuppeteerSharp on Ubuntu server..."

# Update package list
sudo apt-get update

# Install required dependencies for Chrome
sudo apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils

# Download and install Google Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Alternative: Install Chromium (lighter alternative)
# sudo apt-get install -y chromium-browser

# Install additional fonts for better PDF rendering
sudo apt-get install -y \
    fonts-noto \
    fonts-noto-color-emoji \
    fonts-dejavu-core \
    fonts-liberation2 \
    fonts-roboto \
    fontconfig

# Update font cache
sudo fc-cache -f -v

echo "Chrome installation completed!"
echo "Verifying Chrome installation..."

# Check Chrome version
if command -v google-chrome &> /dev/null; then
    google-chrome --version
    echo "Chrome installed successfully at: $(which google-chrome)"
else
    echo "Chrome installation may have failed. Please check manually."
fi

# Set proper permissions for Chrome
sudo chmod 755 /usr/bin/google-chrome || true
sudo chmod 755 /usr/bin/google-chrome-stable || true

echo "Setup complete! PuppeteerSharp should now work on this Ubuntu server."
echo ""
echo "If you still encounter issues, you may need to:"
echo "1. Run your application with --no-sandbox flag"
echo "2. Ensure the application user has proper permissions"
echo "3. Check firewall settings if running in Docker"