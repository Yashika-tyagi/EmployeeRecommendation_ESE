import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddEmployeePage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        skills: '',
        performanceScore: '',
        experience: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            const dataToSubmit = {
                ...formData,
                skills: skillsArray,
                performanceScore: Number(formData.performanceScore),
                experience: Number(formData.experience)
            };

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/employees`, dataToSubmit, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/employees');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add employee.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div className="glass" style={{ width: '250px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3>HR Portal</h3>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/employees">Employee List</Link>
                    <Link to="/add-employee" style={{ fontWeight: 'bold' }}>Add Employee</Link>
                </nav>
                <button className="btn btn-secondary" style={{ marginTop: 'auto' }} onClick={handleLogout}>Logout</button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h2>Register New Employee</h2>
                </header>

                <div className="glass" style={{ padding: '30px', maxWidth: '600px' }}>
                    {error && <div style={{ color: 'var(--accent)', marginBottom: '20px' }}>{error}</div>}
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label>Full Name</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="John Doe" />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label>Email Address</label>
                            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="john@company.com" />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label>Department</label>
                            <input type="text" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required placeholder="e.g. Development" />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label>Skills (comma separated)</label>
                            <input type="text" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} required placeholder="e.g. React, Node, SQL" />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                                <label>Performance Score (0-100)</label>
                                <input type="number" value={formData.performanceScore} onChange={(e) => setFormData({...formData, performanceScore: e.target.value})} required min="0" max="100" placeholder="e.g. 85" />
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                                <label>Experience (Years)</label>
                                <input type="number" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} required min="0" placeholder="e.g. 3" />
                            </div>
                        </div>
                        
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }} disabled={loading}>
                            {loading ? 'Registering...' : 'Register Employee'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEmployeePage;
