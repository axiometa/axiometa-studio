import { useState } from 'react';
import { api } from '../services/api';
import { browserFlasher } from '../services/flasher';
import { connectionService } from '../services/connection';

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [compilationLogs, setCompilationLogs] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [needsReconnect, setNeedsReconnect] = useState(false);

  const upload = async (code, expectedCode = '', instruction = '', onSuccess = null) => {
    if (!code.trim()) return;

    setIsUploading(true);
    setUploadStatus('Axie is checking your code...');
    setCompilationLogs('');
    setValidationError(null);
    setNeedsReconnect(false);

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

      setUploadStatus('Upload complete! Click "Reconnect" below to see serial output.');
      setCompilationLogs(prev => prev + 'Upload complete!\n');
      setCompilationLogs(prev => prev + '\n⚠️  Device needs reconnection - click "Reconnect" button below\n');
      
      // Set flag to show reconnect button
      setNeedsReconnect(true);

      if (onSuccess) onSuccess();

      return { success: true, stars: 3 };

    } catch (error) {
      setUploadStatus('Upload failed');
      setCompilationLogs(prev => prev + `Error: ${error.message}\n`);
      setNeedsReconnect(false);
      return { success: false, stars: 0 };
    } finally {
      setIsUploading(false);
    }
  };

  const reconnect = async () => {
    setUploadStatus('Reconnecting...');
    setCompilationLogs(prev => prev + 'Reconnecting to device...\n');
    
    try {
      await new Promise(r => setTimeout(r, 1000)); // Wait for device to boot
      await connectionService.connect();
      
      setUploadStatus('Connected! Your code is running.');
      setCompilationLogs(prev => prev + '✅ Reconnected successfully!\n');
      setNeedsReconnect(false);
    } catch (error) {
      setUploadStatus('Reconnection failed - click "Reconnect" again');
      setCompilationLogs(prev => prev + `❌ Reconnection failed: ${error.message}\n`);
    }
  };

  return {
    isUploading,
    uploadStatus,
    compilationLogs,
    validationError,
    needsReconnect,
    upload,
    reconnect,
    setCompilationLogs
  };
}