import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiDatabase, FiLogOut, FiTerminal, FiLayout } from 'react-icons/fi';
import '../styles/main.scss';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('cipher_auth_token');

    const handleLogout = () => {
        localStorage.removeItem('cipher_auth_token');
        navigate('/login');
    };

    // Helper to determine if a link is active
    const isActive = (path) => location.pathname === path;

    return (
        <div className="app-layout" style={{ 
            backgroundColor: '#0a0c10',
            color: '#e2e8f0',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <nav style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '0.75rem 0',
                background: 'rgba(13, 17, 23, 0.7)',
                backdropFilter: 'blur(12px)',
                position: 'overflow',
                top: 0,
                zIndex: 100,
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}>
                <div className="container" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                            <div style={{
                                width: '34px', height: '34px',
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                borderRadius: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white',
                                boxShadow: '0 0 15px rgba(79, 70, 229, 0.4)'
                            }}>
                                <FiDatabase size={18} />
                            </div>
                            <h1 style={{
                                margin: 0, fontSize: '1.15rem', fontWeight: '700',
                                color: '#fff', letterSpacing: '-0.02em'
                            }}>
                                Cipher<span style={{ color: '#818cf8' }}>SQL</span>
                            </h1>
                        </Link>

                        {/* Secondary Nav Links (Visual interest) */}
                        {isAuthenticated && (
                            <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
                                <Link to="/dashboard" style={navItemStyle(isActive('/dashboard'))}>
                                    <FiLayout size={14} /> Dashboard
                                </Link>
                                <Link to="/query" style={navItemStyle(isActive('/query'))}>
                                    <FiTerminal size={14} /> Editor
                                </Link>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {isAuthenticated ? (
                            <button onClick={handleLogout} className="logout-btn" style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: '#94a3b8',
                                padding: '0.5rem 1rem',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s ease'
                            }}>
                                <FiLogOut size={14} /> Sign Out
                            </button>
                        ) : (
                            <Link to="/login" style={{
                                textDecoration: 'none',
                                background: '#4f46e5',
                                color: 'white',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                            }}>
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className={location.pathname.startsWith('/assignment/') ? 'container-fluid' : 'container'} 
                style={{ 
                    marginTop: '2.5rem', 
                    flex: 1,
                    maxWidth: location.pathname.startsWith('/assignment/') ? '100%' : '1200px',
                    margin: '2.5rem auto 0 auto',
                    padding: '0 1.5rem',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    minHeight: '70vh'
                }}>
                    {children}
                </div>
            </main>

            <footer style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                fontSize: '0.8rem', 
                color: '#475569',
                borderTop: '10px solid rgba(255,255,255,0.02)'
            }}>
                <span style={{ color: '#818cf8' }}>Created by Vipul Kumar</span> • {new Date().getFullYear()}
            </footer>
        </div>
    );
};

// Reusable style for nav links
const navItemStyle = (active) => ({
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: active ? '#fff' : '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
    transition: 'color 0.2s ease'
});

export default Layout;