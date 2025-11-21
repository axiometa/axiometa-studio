#!/bin/bash
set -e

echo "📦 Installing Arduino CLI..."

# Download Arduino CLI
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh

# Move to a directory in PATH
mkdir -p $HOME/.local/bin
mv bin/arduino-cli $HOME/.local/bin/
export PATH=$HOME/.local/bin:$PATH

echo "✅ Arduino CLI installed"

# Install ESP32 board support
echo "📦 Installing ESP32 board support..."
arduino-cli config init
arduino-cli config add board_manager.additional_urls https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
arduino-cli core update-index
arduino-cli core install esp32:esp32

echo "✅ ESP32 board support installed"
