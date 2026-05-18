import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeListPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState({ department: '', skills: '', minScore: '' });
    const navigate = useNavigate();

    const fetchEmployees = async (query = '') => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/employees/search${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(response.data);
        } catch (err) {
            setError('Failed to fetch employees.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        let query = '?';
        if (search.department) query += `department=${search.department}&`;
        if (search.skills) query += `skills=${search.skills}&`;
        if (search.minScore) query += `minScore=${search.minScore}&`;
        fetchEmployees(query);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading && employees.length === 0) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading employees...</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div className="glass" style={{ width: '250px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3>HR Portal</h3>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/employees" style={{ fontWeight: 'bold' }}>Employee List</Link>
                    <Link to="/add-employee">Add Employee</Link>
                </nav>
                <button className="btn btn-secondary" style={{ marginTop: 'auto' }} onClick={handleLogout}>Logout</button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2>Employee Directory</h2>
                    <Link to="/add-employee" className="btn btn-primary">Add New Employee</Link>
                </header>

                {/* Search & Filter */}
                <form onSubmit={handleSearch} className="glass" style={{ padding: '20px', marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label>Department</label>
                        <input type="text" value={search.department} onChange={(e) => setSearch({...search, department: e.target.value})} placeholder="e.g. Development" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label>Skills (comma separated)</label>
                        <input type="text" value={search.skills} onChange={(e) => setSearch({...search, skills: e.target.value})} placeholder="e.g. React,Node" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label>Min Score</label>
                        <input type="number" value={search.minScore} onChange={(e) => setSearch({...search, minScore: e.target.value})} placeholder="e.g. 80" />
                    </div>
                    <button type="submit" className="btn btn-primary">Search</button>
                    <button type="button" className="btn btn-secondary" onClick={() => { setSearch({department:'', skills:'', minScore:''}); fetchEmployees(); }}>Reset</button>
                </form>

                {error && <div style={{ color: 'var(--accent)', marginBottom: '20px' }}>{error}</div>}

                {/* Employee List */}
                {loading ? <div style={{ textAlign: 'center' }}>Loading...</div> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {employees.map(emp => (
                            <div key={emp._id} className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3>{emp.name}</h3>
                                    <span style={{ 
                                        padding: '2px 8px', 
                                        borderRadius: '12px', 
                                        fontSize: '0.8rem',
                                        background: emp.performanceScore >= 80 ? 'rgba(16, 185, 129, 0.2)' : emp.performanceScore >= 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: emp.performanceScore >= 80 ? '#10b981' : emp.performanceScore >= 50 ? '#f59e0b' : '#ef4444'
                                    }}>
                                        Score: {emp.performanceScore}
                                    </span>
                                </div>
                                <div><strong>Department:</strong> {emp.department}</div>
                                <div><strong>Experience:</strong> {emp.experience} years</div>
                                <div><strong>Skills:</strong> {emp.skills.join(', ')}</div>
                                <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', gap: '10px' }}>
                                    <Link to={`/recommendation/${emp._id}`} className="btn btn-secondary" style={{ width: '100%' }}>AI Analysis</Link>
                                </div>
                            </div>
                        ))}
                        {employees.length === 0 && <div style={{ textAlign: 'center', gridColumn: '1/-1' }}>No employees found.</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeListPage;
