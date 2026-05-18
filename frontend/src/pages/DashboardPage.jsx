import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/employees`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployees(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard data.');
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [navigate]);

    const getRankings = () => {
        const high = employees.filter(e => e.performanceScore >= 80).length;
        const medium = employees.filter(e => e.performanceScore >= 50 && e.performanceScore < 80).length;
        const low = employees.filter(e => e.performanceScore < 50).length;
        return { high, medium, low };
    };

    const rankings = getRankings();

    const topPerformers = [...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 3);
    const lowPerformers = [...employees].sort((a, b) => a.performanceScore - b.performanceScore).slice(0, 3);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading dashboard...</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div className="glass" style={{ width: '250px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3>HR Portal</h3>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link to="/dashboard" style={{ fontWeight: 'bold' }}>Dashboard</Link>
                    <Link to="/employees">Employee List</Link>
                    <Link to="/add-employee">Add Employee</Link>
                </nav>
                <button className="btn btn-secondary" style={{ marginTop: 'auto' }} onClick={handleLogout}>Logout</button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2>Dashboard Overview</h2>
                    <div>Welcome, HR Admin</div>
                </header>

                {error && <div style={{ color: 'var(--accent)', marginBottom: '20px' }}>{error}</div>}

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                        <h4>Total Employees</h4>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{employees.length}</div>
                    </div>
                    <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                        <h4>High Performers (≥80)</h4>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{rankings.high}</div>
                    </div>
                    <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                        <h4>Medium (50-79)</h4>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{rankings.medium}</div>
                    </div>
                    <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                        <h4>Needs Improvement</h4>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{rankings.low}</div>
                    </div>
                </div>

                {/* Rankings Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {/* Top Performers */}
                    <div className="glass" style={{ padding: '20px' }}>
                        <h3>Top Performers</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                            {topPerformers.map(emp => (
                                <div key={emp._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{emp.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{emp.department}</div>
                                    </div>
                                    <div style={{ color: '#10b981', fontWeight: 'bold' }}>{emp.performanceScore}</div>
                                </div>
                            ))}
                            {topPerformers.length === 0 && <div>No employees found.</div>}
                        </div>
                    </div>

                    {/* Low Performers */}
                    <div className="glass" style={{ padding: '20px' }}>
                        <h3>Needs Improvement</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                            {lowPerformers.filter(e => e.performanceScore < 50).map(emp => (
                                <div key={emp._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{emp.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{emp.department}</div>
                                    </div>
                                    <div style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{emp.performanceScore}</div>
                                </div>
                            ))}
                            {lowPerformers.filter(e => e.performanceScore < 50).length === 0 && <div>All employees are doing well!</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
