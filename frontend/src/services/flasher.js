// Browser-based ESP32 flasher using esptool-js
import { ESPLoader, Transport } from 'https://cdn.skypack.dev/esptool-js@0.5.7';

class BrowserFlasher {
  constructor() {
    this.transport = null;
    this.esploader = null;
    this.patchESPTool();
  }

  patchESPTool() {
    const originalBstrToUi8 = ESPLoader.prototype.bstrToUi8;
    ESPLoader.prototype.bstrToUi8 = function(bStr) {
      if (bStr instanceof Uint8Array) return bStr;
      if (bStr instanceof ArrayBuffer) return new Uint8Array(bStr);
      return originalBstrToUi8.call(this, bStr);
    };
  }

  log(message, callback) {
    if (callback) callback(message);
    console.log(message);
  }

  async resetIntoBootloader(transport) {
    // Standard Arduino-style reset sequence
    await transport.setDTR(false);
    await transport.setRTS(true);
    await new Promise(r => setTimeout(r, 100));
    await transport.setDTR(true);
    await transport.setRTS(false);
    await new Promise(r => setTimeout(r, 50));
    await transport.setDTR(false);
    await new Promise(r => setTimeout(r, 50));
  }

  async hardReset(transport) {
    await transport.setDTR(false);
    await transport.setRTS(true);
    await new Promise(r => setTimeout(r, 100));
    await transport.setRTS(false);
    await new Promise(r => setTimeout(r, 50));
  }

  async flashWithDevice(device, binaries, onLog) {
    try {
      this.log('⚡ Opening connection at 115200 baud...', onLog);
      this.transport = new Transport(device, true);
      
      // Reset into bootloader mode FIRST
      this.log('🔄 Resetting ESP32 into bootloader mode...', onLog);
      await this.resetIntoBootloader(this.transport);
      await new Promise(r => setTimeout(r, 200));
      
      // Create ESP loader
      this.esploader = new ESPLoader({
        transport: this.transport,
        baudrate: 115200,
        terminal: {
          clean: () => {},
          writeLine: (data) => this.log(data, onLog),
          write: (data) => this.log(data, onLog)
        }
      });

      this.log('🔍 Detecting chip...', onLog);
      
      let chipName = 'ESP32';
      try {
        chipName = await this.esploader.main();
        this.log(`✅ Connected to ${chipName}`, onLog);
      } catch (e) {
        this.log(`⚠️ Using ROM bootloader mode`, onLog);
      }

      // Set flash parameters
      this.esploader.flashSize = '4MB';

      // Prepare binaries
      const fileArray = [];
      
      for (const [name, binary] of Object.entries(binaries)) {
        const binaryData = Uint8Array.from(atob(binary.data), c => c.charCodeAt(0));
        const offset = parseInt(binary.offset, 16);
        
        fileArray.push({
          data: binaryData,
          address: offset
        });
        
        this.log(`📦 ${name}: ${binaryData.length} bytes at ${binary.offset}`, onLog);
      }

      this.log('🔥 Flashing firmware...', onLog);

      // Flash
      await this.esploader.writeFlash({
        fileArray,
        flashSize: '4MB',
        flashMode: 'dio',
        flashFreq: '40m',
        eraseAll: false,
        compress: true,
        reportProgress: (index, written, total) => {
          const percent = Math.floor((written / total) * 100);
          if (percent % 10 === 0 || percent === 100) {
            this.log(`  ${percent}%`, onLog);
          }
        }
      });

      this.log('✅ Flash complete!', onLog);
      this.log('🔄 Resetting ESP32...', onLog);

      // Reset to run new code
      await this.hardReset(this.transport);
      
      this.log('⏳ Starting your code...', onLog);
      await new Promise(r => setTimeout(r, 1500));

      // Disconnect cleanly
      await this.transport.disconnect();
      
      this.log('🎉 Upload successful!', onLog);

      return { success: true };

    } catch (error) {
      this.log(`❌ ${error.message}`, onLog);
      
      if (this.transport) {
        try {
          await this.transport.disconnect();
        } catch (e) {}
      }
      
      throw error;
    }
  }

  // Original method for backward compatibility
  async flash(binaries, onLog) {
    try {
      this.log('🔌 Requesting serial port...', onLog);
      const device = await navigator.serial.requestPort();
      return await this.flashWithDevice(device, binaries, onLog);
    } catch (error) {
      this.log(`❌ ${error.message}`, onLog);
      throw error;
    }
  }
}

export const browserFlasher = new BrowserFlasher();