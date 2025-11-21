#!/bin/bash
set -e

ARDUINO_DIR="/app/.arduino"
ARDUINO_CLI="$ARDUINO_DIR/bin/arduino-cli"

if [ -f "$ARDUINO_CLI" ]; then
    echo "Arduino CLI cached"
    exit 0
fi

echo "Installing Arduino CLI..."
mkdir -p $ARDUINO_DIR/bin
cd $ARDUINO_DIR
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=$ARDUINO_DIR/bin sh

export PATH="$ARDUINO_DIR/bin:$PATH"
export ARDUINO_DATA_DIR="$ARDUINO_DIR/data"

echo "Installing ESP32 core (2-3 min, ~500MB)..."
arduino-cli config init --additional-urls https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
arduino-cli core update-index
arduino-cli core install esp32:esp32

# Cleanup to save disk space
echo "Cleaning up..."
rm -rf $ARDUINO_DIR/data/tmp/*
rm -rf $ARDUINO_DIR/data/packages/esp32/tools/*/doc
rm -rf $ARDUINO_DIR/data/packages/esp32/hardware/esp32/*/docs
find $ARDUINO_DIR -name "*.a" -size +1M -delete  # Remove large static libs we don't need

echo "Done - disk usage reduced"

