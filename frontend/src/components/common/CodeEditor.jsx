import React from 'react';
import Editor from '@monaco-editor/react';
import { borderRadius } from '../../styles/theme';

const styles = {
  container: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    border: '1px solid #333'
  }
};

export default function CodeEditor({ 
  code, 
  onChange, 
  height = '350px',
  readOnly = false 
}) {
  return (
    <div style={styles.container}>
      <Editor
        height={height}
        defaultLanguage="cpp"
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          readOnly,
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />
    </div>
  );
}
