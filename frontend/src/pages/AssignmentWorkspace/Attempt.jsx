import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiPlay, FiHelpCircle, FiDatabase, FiCpu, FiAlertTriangle, FiWifiOff, FiCode } from 'react-icons/fi';
import SqlEditor from "../../components/SqlEditor";
import Loader from '../../components/Loader';
import { useToast } from '../../components/ToastContext';
import './Attempt.scss';

const Attempt = () => {
    const { id } = useParams();
    const { addToast } = useToast();
    const [assignment, setAssignment] = useState(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [executing, setExecuting] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [sidebarWidth, setSidebarWidth] = useState(550);
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/assignments/${id}`);
                setAssignment(res.data);

                // PERSISTENCE LOGIC (Time-Gated for Strict Mode Check):
                // 1. Check if page was Reloaded.
                // 2. Allow restoration ONLY if it's the first few seconds of page load 
                //    (prevents stale 'reload' type from effecting SPA navigation later).

                const nav = performance.getEntriesByType("navigation")[0];
                const isReload = nav && nav.type === 'reload';

                // Use a global timestamp to track when we last restored this assignment.
                // If we are remounting (Strict Mode), the timestamp will be recent (< 2000ms).
                // If we navigated away and came back, it will be old or undefined.
                const lastRestoreKey = `cipher_restore_ts_${id}`;
                const lastRestore = window[lastRestoreKey];
                const now = Date.now();

                const isRecentRestore = lastRestore && (now - lastRestore < 2000);
                const isFreshReload = isReload && !lastRestore; // First pass of reload

                const savedQuery = localStorage.getItem(`cipher_query_${id}`);

                if ((isFreshReload || isRecentRestore) && savedQuery) {
                    setQuery(savedQuery);
                    window[lastRestoreKey] = now; // Update timestamp
                } else {
                    setQuery('-- Write your SQL query here\n');
                }
            } catch (err) {
                console.error(err);
                const msg = "Failed to load assignment. Please try again.";
                setFetchError(msg);
                addToast({ message: msg, type: "error" });
            }
        };
        fetchAssignment();
    }, [id, addToast]);

    // SAVE: Always save progress (for potential reload)
    useEffect(() => {
        if (id && query) {
            localStorage.setItem(`cipher_query_${id}`, query);
        }
    }, [query, id]);

    const startResizing = (e) => {
        setIsResizing(true);
        e.preventDefault();
    };

    const stopResizing = () => {
        setIsResizing(false);
    };

    const resize = (e) => {
        if (isResizing) {
            const newWidth = e.clientX;
            if (newWidth > 300 && newWidth < 800) {
                setSidebarWidth(newWidth);
            }
        }
    };

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing]);

    const handleExecute = async () => {
        setExecuting(true);
        setError(null);
        setResults(null);
        try {
            const res = await axios.post('http://localhost:5000/api/query', {
                sql: query,
                assignmentId: assignment._id
            });

            const data = Array.isArray(res.data) ? res.data : res.data.rows;
            const isMock = !Array.isArray(res.data) && res.data.isMock;

            if (isMock) {
                // If using cached data because sandbox is offline
                setError(res.data.message || "Sandbox Offline: Using Cached Data");
                addToast({ message: "Sandbox offline. Showing cached results.", type: "warning" });
            } else {
                addToast({ message: "Query executed successfully", type: "success" });
            }

            setResults(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            setError(errorMsg);
            addToast({ message: "Execution failed", type: "error" });
        } finally {
            setExecuting(false);
        }
    };

    const handleGetHint = async () => {
        if (!assignment || !query) return;

        addToast({ message: "Asking AI for help...", type: "info" });

        try {
            const res = await axios.post('http://localhost:5000/api/hints', {
                assignmentId: assignment._id,
                userQuery: query
            });
            addToast({ message: "Hint received!", type: "success" });
            alert(res.data.hint);
        } catch (err) {
            console.error(err);
            addToast({ message: "Failed to get hint", type: "error" });
        }
    };

    if (fetchError) return (
        <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#f43f5e' }}>
            <h2>Error Loading Assignment</h2>
            <p>{fetchError}</p>
        </div>
    );

    if (!assignment) return <Loader text="Loading Workspace..." />;

    return (
        <div className="workspace" style={{ gridTemplateColumns: `${sidebarWidth}px 10px 1fr` }}>
            {/* Left Panel: Question & Schema */}
            <div className="panel left-panel">
                <div className="question-section">
                    <h2>{assignment.title}</h2>
                    <p style={{ color: '#94a3b8' }}>{assignment.description}</p>
                    <div className="instruction-box">
                        <div className="box-header">
                            <FiHelpCircle /> Target Goal
                        </div>
                        <div className="box-content">
                            {assignment.question}
                        </div>
                    </div>
                </div>

                <div className="schema-section">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#f8fafc' }}>
                        <FiDatabase /> <h3>Database Schema</h3>
                    </div>

                    {assignment.tables.map((t, idx) => (
                        <div key={idx} className="table-schema">
                            <div className="table-header">
                                <code>{t.tableName}</code>
                            </div>
                            <ul className="column-list">
                                {t.columns.map((c, i) => (
                                    <li key={i}>
                                        <span className="col-name">{c.name}</span>
                                        <span className="col-type">{c.dataType}</span>
                                    </li>
                                ))}
                            </ul>

                            {t.previewRows && t.previewRows.length > 0 && (
                                <div className="sample-data">
                                    <span className="sample-label">Sample Data</span>
                                    <div className="table-responsive">
                                        <table>
                                            <thead>
                                                <tr>
                                                    {Object.keys(t.previewRows[0]).filter(k => k !== '_id').map(k => (
                                                        <th key={k}>{k}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {t.previewRows.slice(0, 3).map((row, rI) => (
                                                    <tr key={rI}>
                                                        {Object.keys(row).filter(k => k !== '_id').map((k, cI) => (
                                                            <td key={cI}>{row[k]}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div
                className={`resizer ${isResizing ? 'active' : ''}`}
                onMouseDown={startResizing}
            />

            {/* Right Panel: Editor & Results */}
            <div className="panel right-panel">
                <div className="editor-section">
                    <div className="execution-controls">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiCode /> <span>SQL Editor</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-secondary" onClick={handleGetHint}>
                                <FiCpu /> Get Hint
                            </button>
                            <button className="btn btn-primary" onClick={handleExecute} disabled={executing}>
                                {executing ? <FiCpu className="spin" /> : <FiPlay />}
                                {executing ? 'Running...' : 'Execute'}
                            </button>
                        </div>
                    </div>
                    <div className="editor-container">
                        <SqlEditor value={query} onChange={val => setQuery(val)} height="300px" />
                    </div>
                </div>

                <div className="results-section">
                    {/* Error / Warning Display */}
                    {error && (
                        <div
                            className={`message-box ${error.includes("Sandbox Offline") ? 'warning' : 'error'}`}
                        >
                            {error.includes("Sandbox Offline") ? <FiWifiOff size={20} /> : <FiAlertTriangle size={20} />}
                            <div>
                                <strong>{error.includes("Sandbox Offline") ? 'Offline Mode' : 'Execution Error'}</strong>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    {!executing && results && (
                        <div
                            className="results-table-wrapper"
                        >
                            <table>
                                <thead>
                                    <tr>
                                        {Object.keys(results[0] || {}).map(k => <th key={k}>{k}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((row, i) => (
                                        <tr key={i}>
                                            {Object.values(row).map((val, j) => <td key={j}>{String(val)}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!results && !error && (
                        <div className="empty-state">
                            <FiPlay size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>Execute a query to see results</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Attempt;