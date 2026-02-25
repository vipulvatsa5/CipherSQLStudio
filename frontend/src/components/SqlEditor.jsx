import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

const SqlEditor = ({ value, onChange, onExecute, height = "400px", readOnly = false }) => {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            if (onExecute) onExecute(editor.getValue());
        });

        
        editor.focus();
    };

    const editorOptions = {
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontLigatures: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        roundedSelection: true,
        cursorSmoothCaretAnimation: "on",
        cursorBlinking: "smooth",
        renderLineHighlight: "all",
        lineNumbersMinChars: 3,
        padding: { top: 16, bottom: 16 },
        wordWrap: "on",
        scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
        },
        suggest: {
            showKeywords: true,
            showSnippets: true,
        },
    };

    return (
        <div className="editor-window-frame" style={{ border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
            <div className="editor-header" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '8px 16px', 
                background: '#1e1e1e', 
                borderBottom: '1px solid #333' 
            }}>
                <div className="window-dots" style={{ display: 'flex', gap: '6px' }}>
                    <span className="dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></span>
                    <span className="dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></span>
                    <span className="dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></span>
                </div>
                <div className="editor-label" style={{ 
                    marginLeft: '16px', 
                    fontSize: '12px', 
                    color: '#888', 
                    fontFamily: 'sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Query Editor
                </div>
            </div>

            <div className="sql-editor-wrapper">
                <Editor
                    height={height}
                    defaultLanguage="sql"
                    theme="vs-dark"
                    value={value}
                    onChange={onChange}
                    onMount={handleEditorDidMount}
                    loading={<div className="editor-loading">Loading SQL Engine...</div>}
                    options={editorOptions}
                />
            </div>
        </div>
    );
};

export default SqlEditor;