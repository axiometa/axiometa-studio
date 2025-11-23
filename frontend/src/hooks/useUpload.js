import { useState } from 'react';
import { api } from '../services/api';
import { browserFlasher } from '../services/flasher';
import { connectionService } from '../services/connection';

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [compilationLogs, setCompilationLogs] = useState('');
  const [validationError, setValidationError] = useState(null);

  const upload = async (code, expectedCode = '', instruction = '', onSuccess = null) => {
    if (!code.trim()) return;

    setIsUploading(true);
    setUploadStatus('Axie is checking your code...');
    setCompilationLogs('');
    setValidationError(null);

    try {
      const device = connectionService.getPort();
      
      if (!device) {
        throw new Error('Device not connected. Please connect your ESP32 first.');
      }
      
      // Validate code
      setUploadStatus('Axie is checking your code...');
      const validation = await api.validateCode(code, expectedCode, instruction);
      
      if (!validation.is_valid) {
        setValidationError(validation.message);
        setUploadStatus('Code needs some fixes');
        setCompilationLogs('Validation failed:\n' + validation.message);
        setIsUploading(false);
        return { success: false, stars: 0 };
      }
      
      // Compile
      setUploadStatus('Axie is compiling your code...');
      setCompilationLogs(prev => prev + 'Compiling code...\n');
      
      const compileResult = await api.compile(code);
      
      if (!compileResult.success) {
        throw new Error('Compilation failed');
      }

      setCompilationLogs(prev => prev + 'Compilation successful!\n');
      setCompilationLogs(prev => prev + `Generated ${Object.keys(compileResult.binaries).length} binary file(s)\n`);
      
      // Flash
      setUploadStatus('Uploading to your device...');
      setCompilationLogs(prev => prev + 'Starting upload...\n');
      
      await connectionService.disconnect();
      
      await browserFlasher.flashWithDevice(device, compileResult.binaries, (message) => {
        setCompilationLogs(prev => prev + message + '\n');
      });

      setUploadStatus('Upload complete! Reconnecting...');
      setCompilationLogs(prev => prev + 'Upload complete!\n');
      
      // AUTO-RECONNECT - Reopen the SAME port (no user gesture needed!)
      setCompilationLogs(prev => prev + 'Waiting for device to boot...\n');
      await new Promise(r => setTimeout(r, 2000)); // Wait 2 seconds for device reset
      
      setCompilationLogs(prev => prev + 'Reconnecting...\n');
      try {
        // Reopen the same port instead of requesting a new one
        await device.open({ baudRate: 9600 });
        connectionService.port = device; // Restore the port reference
        connectionService.isConnected = true;
        connectionService.startReading(); // Restart serial reading
        
        setUploadStatus('✅ Success! Your code is running.');
        setCompilationLogs(prev => prev + '✅ Reconnected! Your code is running.\n');
      } catch (reconnectError) {
        // If auto-reconnect fails, just notify but don't fail the upload
        setUploadStatus('Upload complete! (Manual reconnect needed)');
        setCompilationLogs(prev => prev + `⚠️ Auto-reconnect failed: ${reconnectError.message}\n`);
        setCompilationLogs(prev => prev + '💡 Try disconnecting and reconnecting your device.\n');
      }

      if (onSuccess) onSuccess();

      return { success: true, stars: 3 };

    } catch (error) {
      setUploadStatus('Upload failed');
      setCompilationLogs(prev => prev + `Error: ${error.message}\n`);
      return { success: false, stars: 0 };
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ ADD RESET FUNCTION
  const resetUploadState = () => {
    setUploadStatus('');
    setCompilationLogs('');
    setValidationError(null);
  };

  return {
    isUploading,
    uploadStatus,
    compilationLogs,
    validationError,
    upload,
    setCompilationLogs,
    resetUploadState  // ✅ EXPORT THIS
  };
}