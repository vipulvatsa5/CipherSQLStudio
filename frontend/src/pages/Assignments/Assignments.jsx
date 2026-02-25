import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiLock, FiSearch } from 'react-icons/fi';
import Loader from '../../components/Loader';
import './Assignments.scss';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/assignments');
                setAssignments(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch assignments. Is the server running?');
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    if (loading) return <Loader text="Loading Assignments..." />;

    if (error) return (
        <div className="error-container">
            <h2>Connection Error</h2>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="leetcode-container">
            <div className="list-controls">
                <div className="search-wrapper">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search questions" />
                </div>
            </div>

            <table className="problem-table">
                <thead>
                    <tr>
                        <th className="col-status">Status</th>
                        <th className="col-title">Title</th>
                        <th className="col-diff">Difficulty</th>
                        <th className="col-solution">Solution</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((a, index) => (
                        <tr key={a._id}>
                            <td className="status-cell">
                                <FiCheckCircle className="status-icon solved" />
                            </td>
                            <td className="title-cell">
                                <Link to={`/assignment/${a._id}`}>
                                    {index + 1}. {a.title}
                                </Link>
                            </td>
                            <td className={`diff-cell ${a.difficulty.toLowerCase()}`}>
                                {a.difficulty === "Medium" ? "Med." : a.difficulty}
                            </td>
                            <td className="solution-cell">
                                <FiLock size={16} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Assignments;