#!/bin/bash
set -e

ARDUINO_DIR="/app/.arduino"

if [ -f "$ARDUINO_DIR/bin/arduino-cli" ]; then
    echo "Arduino CLI cached"
    exit 0
fi

echo "Installing Arduino CLI..."
mkdir -p $ARDUINO_DIR/bin
cd $ARDUINO_DIR
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=$ARDUINO_DIR/bin sh

export PATH="$ARDUINO_DIR/bin:$PATH"
export ARDUINO_DATA_DIR="$ARDUINO_DIR/data"

echo "Installing ESP32 core..."
arduino-cli config init --additional-urls https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
arduino-cli core update-index
arduino-cli core install esp32:esp32

echo "Done"