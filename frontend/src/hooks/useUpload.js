import { useState, useCallback } from 'react';
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
      // FIRST: Verify connection is still valid
      setUploadStatus('Verifying device connection...');
      setCompilationLogs('Checking device connection...\n');
      
      const isStillConnected = await connectionService.verifyConnection();
      
      if (!isStillConnected) {
        setCompilationLogs(prev => prev + '⚠️ Device is not connected or was disconnected.\n');
        setCompilationLogs(prev => prev + '💡 Please reconnect your device and try again.\n');
        setUploadStatus('Device disconnected - please reconnect');
        setNeedsReconnect(true);
        setIsUploading(false);
        return { success: false, stars: 0, needsReconnect: true };
      }

      const device = connectionService.getPort();
      
      if (!device) {
        setCompilationLogs(prev => prev + '⚠️ No device found.\n');
        setUploadStatus('No device connected');
        setNeedsReconnect(true);
        setIsUploading(false);
        return { success: false, stars: 0, needsReconnect: true };
      }
      
      setCompilationLogs(prev => prev + '✅ Device connected\n');

      // Validate code
      setUploadStatus('Axie is checking your code...');
      const validation = await api.validateCode(code, expectedCode, instruction);
      
      if (!validation.is_valid) {
        setValidationError(validation.message);
        setUploadStatus('Code needs some fixes');
        setCompilationLogs(prev => prev + 'Validation failed:\n' + validation.message + '\n');
        setIsUploading(false);
        return { success: false, stars: 0 };
      }
      
      setCompilationLogs(prev => prev + '✅ Code validation passed\n');
      
      // Compile
      setUploadStatus('Axie is compiling your code...');
      setCompilationLogs(prev => prev + 'Compiling code...\n');
      
      const compileResult = await api.compile(code);
      
      if (!compileResult.success) {
        throw new Error('Compilation failed');
      }

      setCompilationLogs(prev => prev + '✅ Compilation successful!\n');
      setCompilationLogs(prev => prev + `Generated ${Object.keys(compileResult.binaries).length} binary file(s)\n`);
      
      // Verify connection again before flash (user might have unplugged during compile)
      setCompilationLogs(prev => prev + 'Verifying connection before upload...\n');
      const stillConnectedBeforeFlash = await connectionService.verifyConnection();
      
      if (!stillConnectedBeforeFlash) {
        setCompilationLogs(prev => prev + '⚠️ Device disconnected during compilation.\n');
        setCompilationLogs(prev => prev + '💡 Please reconnect and try again.\n');
        setUploadStatus('Device disconnected - please reconnect');
        setNeedsReconnect(true);
        setIsUploading(false);
        return { success: false, stars: 0, needsReconnect: true };
      }
      
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
        setNeedsReconnect(false);
      } catch (reconnectError) {
        // If auto-reconnect fails, notify user but don't fail the upload
        setUploadStatus('Upload complete! Click reconnect to continue.');
        setCompilationLogs(prev => prev + `⚠️ Auto-reconnect failed: ${reconnectError.message}\n`);
        setCompilationLogs(prev => prev + '💡 Click "Reconnect" below to restore serial connection.\n');
        setNeedsReconnect(true);
      }

      if (onSuccess) onSuccess();

      return { success: true, stars: 3 };

    } catch (error) {
      // Check if it's a connection-related error
      const errorMsg = error.message.toLowerCase();
      const isConnectionError = errorMsg.includes('device') || 
                                errorMsg.includes('disconnect') ||
                                errorMsg.includes('port') ||
                                errorMsg.includes('serial') ||
                                errorMsg.includes('bootloader');
      
      if (isConnectionError) {
        setUploadStatus('Connection lost - please reconnect');
        setCompilationLogs(prev => prev + `⚠️ Connection error: ${error.message}\n`);
        setCompilationLogs(prev => prev + '💡 The device may have been disconnected or reset.\n');
        setCompilationLogs(prev => prev + '💡 Click "Reconnect" to re-establish connection.\n');
        setNeedsReconnect(true);
      } else {
        setUploadStatus('Upload failed');
        setCompilationLogs(prev => prev + `Error: ${error.message}\n`);
      }
      
      return { success: false, stars: 0 };
    } finally {
      setIsUploading(false);
    }
  };

  const reconnect = useCallback(async () => {
    setUploadStatus('Reconnecting...');
    setCompilationLogs(prev => prev + '\n🔌 Attempting to reconnect...\n');
    
    try {
      // Clear old port state
      connectionService.clearPort();
      
      // Request new connection
      await connectionService.connect();
      
      setUploadStatus('✅ Reconnected successfully!');
      setCompilationLogs(prev => prev + '✅ Device reconnected!\n');
      setNeedsReconnect(false);
      
      return true;
    } catch (error) {
      setUploadStatus('Reconnect failed - try again');
      setCompilationLogs(prev => prev + `❌ Reconnect failed: ${error.message}\n`);
      return false;
    }
  }, []);

  // Reset all upload state
  const resetUploadState = useCallback(() => {
    setUploadStatus('');
    setCompilationLogs('');
    setValidationError(null);
    setNeedsReconnect(false);
  }, []);

  return {
    isUploading,
    uploadStatus,
    compilationLogs,
    validationError,
    needsReconnect,
    upload,
    reconnect,
    setCompilationLogs,
    resetUploadState
  };
}