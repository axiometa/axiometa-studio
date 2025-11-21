#!/bin/bash
set -e

# Install Python dependencies
pip install -r requirements.txt

# Install Arduino CLI
chmod +x install-arduino-cli.sh
./install-arduino-cli.sh

echo "✅ Build complete"
