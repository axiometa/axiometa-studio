#!/bin/bash
set -e

ARDUINO_DIR="/app/.arduino"
ARDUINO_CLI="$ARDUINO_DIR/bin/arduino-cli"

# Check if already installed
if [ -f "$ARDUINO_CLI" ]; then
    echo "✅ Arduino CLI already installed (using cache)"
    export PATH="$ARDUINO_DIR/bin:$PATH"
    exit 0
fi

echo "📦 Installing Arduino CLI..."

# Download Arduino CLI to /app (persistent)
mkdir -p $ARDUINO_DIR/bin
cd $ARDUINO_DIR
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=$ARDUINO_DIR/bin sh

export PATH="$ARDUINO_DIR/bin:$PATH"

echo "✅ Arduino CLI installed to $ARDUINO_DIR"

# Install ESP32 board support (also goes to /app)
export ARDUINO_DATA_DIR="$ARDUINO_DIR/data"
export ARDUINO_SKETCHBOOK_DIR="$ARDUINO_DIR/sketchbook"

echo "📦 Installing ESP32 board support..."
arduino-cli config init --additional-urls https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
arduino-cli core update-index
arduino-cli core install esp32:esp32

echo "✅ ESP32 board support installed"

# Install common libraries
echo "📦 Installing common libraries..."
arduino-cli lib install "FastLED"
arduino-cli lib install "Adafruit NeoPixel"
arduino-cli lib install "DHT sensor library"
arduino-cli lib install "Adafruit Unified Sensor"
arduino-cli lib install "Servo"

echo "✅ Libraries installed"
echo "📁 All Arduino files stored in: $ARDUINO_DIR"
