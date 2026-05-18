import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecommendationPage = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [recommendation, setRecommendation] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Fetch employee details
                const empResponse = await axios.get(`http://localhost:5000/api/employees`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const emp = empResponse.data.find(e => e._id === id);
                setEmployee(emp);

                // Fetch recommendation
                const recResponse = await axios.post(`http://localhost:5000/api/ai/recommend`, { employeeId: id }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecommendation(recResponse.data.recommendation);
            } catch (err) {
                setError('Failed to fetch recommendation.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Generating AI Recommendation... This may take a few seconds.</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div className="glass" style={{ width: '250px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3>HR Portal</h3>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/employees">Employee List</Link>
                    <Link to="/add-employee">Add Employee</Link>
                </nav>
                <button className="btn btn-secondary" style={{ marginTop: 'auto' }} onClick={handleLogout}>Logout</button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2>AI Performance Analysis</h2>
                    <Link to="/employees" className="btn btn-secondary">Back to List</Link>
                </header>

                {error && <div style={{ color: 'var(--accent)', marginBottom: '20px' }}>{error}</div>}

                {employee && (
                    <div className="glass" style={{ padding: '20px', marginBottom: '30px' }}>
                        <h3>{employee.name}</h3>
                        <p><strong>Department:</strong> {employee.department} | <strong>Score:</strong> {employee.performanceScore} | <strong>Experience:</strong> {employee.experience} years</p>
                    </div>
                )}

                <div className="glass" style={{ padding: '30px', whiteSpace: 'pre-wrap' }}>
                    <h3>AI Recommendations</h3>
                    <div style={{ marginTop: '20px', lineHeight: '1.8' }}>
                        {recommendation || 'No recommendation available.'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationPage;
