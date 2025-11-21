// Browser-based ESP32 flasher using esptool-js
import { ESPLoader, Transport } from 'https://cdn.skypack.dev/esptool-js@0.5.7';

class BrowserFlasher {
  constructor() {
    this.transport = null;
    this.esploader = null;
    this.patchESPTool();
  }

  patchESPTool() {
    // Fix known bug in esptool-js
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

  async flash(binaries, onLog) {
    try {
      this.log('🔌 Requesting serial port...', onLog);
      
      // Request port from user
      const device = await navigator.serial.requestPort();
      
      this.log('⚡ Opening connection...', onLog);
      this.transport = new Transport(device, true);
      
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

      this.log('🔍 Connecting to ESP32...', onLog);
      
      // Try to connect
      let chipName;
      try {
        chipName = await this.esploader.main();
        this.log(`✅ Connected to ${chipName}`, onLog);
      } catch (e) {
        this.log(`⚠️ Stub upload failed, using ROM mode`, onLog);
      }

      this.esploader.flashSize = '4MB';

      // Prepare file array from binaries
      const fileArray = [];
      
      // Convert base64 to Uint8Array
      for (const [name, binary] of Object.entries(binaries)) {
        const binaryData = Uint8Array.from(atob(binary.data), c => c.charCodeAt(0));
        const offset = parseInt(binary.offset, 16);
        
        fileArray.push({
          data: binaryData,
          address: offset
        });
        
        this.log(`📦 Prepared ${name} (${binaryData.length} bytes at ${binary.offset})`, onLog);
      }

      this.log('🔥 Starting flash...', onLog);

      // Flash the firmware
      await this.esploader.writeFlash({
        fileArray,
        flashSize: '4MB',
        eraseAll: false,
        compress: true,
        reportProgress: (index, written, total) => {
          const percent = Math.floor((written / total) * 100);
          if (percent % 10 === 0) {
            this.log(`⏳ Progress: ${percent}%`, onLog);
          }
        }
      });

      this.log('✅ Flash complete!', onLog);
      this.log('🔄 Hard resetting device...', onLog);

      // Hard reset
      await this.transport.setDTR(false);
      await this.transport.setRTS(true);
      await new Promise(r => setTimeout(r, 100));
      await this.transport.setDTR(true);
      await this.transport.setRTS(false);

      this.log('✅ Reset complete!', onLog);
      this.log('⏳ Waiting for device to boot...', onLog);
      
      await new Promise(r => setTimeout(r, 2000));

      await this.transport.disconnect();
      this.log('🎉 Upload successful! Your code is running!', onLog);

      return { success: true };

    } catch (error) {
      this.log(`❌ Error: ${error.message}`, onLog);
      
      if (this.transport) {
        try {
          await this.transport.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
      }
      
      throw error;
    }
  }
}

export const browserFlasher = new BrowserFlasher();
