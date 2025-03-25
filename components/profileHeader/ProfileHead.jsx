import React, { useEffect, useState } from 'react';
import '../profileHeader/ProfileHead.css';
import { FaUserCircle } from 'react-icons/fa';

const ProfileHead = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const username = localStorage.getItem('username');

    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        return new Date(isoString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getDepartment = (dept) => {
        const departments = {
            cse: "Computer Science Engineering",
            mech: "Mechanical Engineering",
            eee: "Electrical Engineering",
            chem: "Chemical Engineering",
            ece: "Electronics Engineering",
            it: "Information Technology",
        };
        return departments[dept] || "Unknown Department";
    };

    useEffect(() => {
        if (username) {
            fetchProfile(username);
        }
    },[]); 

    const fetchProfile = async (username) => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch(`http://localhost:8000/api/profile/?user=${username}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }

            const profileData = await response.json();
            setData(profileData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="container profile-container">
            <div className="profile-header-user">
                <div className="profile-pic-user">
                    <FaUserCircle className="profile-icon-user" />
                </div>
                <div className="profile-details-user">
                    {data ? (
                        <div>
                            <h1 className="username">{data.username}</h1>
                            <p className="user-info">{data.first_name + " " + data.last_name}</p>
                            <p className="user-info">{data.email}</p>
                            <p className="user-info"><strong>Last Login:</strong> {formatDate(data.last_login)}</p>
                            <p className="user-info"><strong>Date Joined:</strong> {formatDate(data.date_joined)}</p>
                            <p className="user-info"><strong>Department:</strong> {getDepartment(data.student.department)}</p>
                            <p className="user-info"><strong>Year:</strong> {data.student.year} year</p>
                        </div>
                    ) : (
                        <p>No profile data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileHead;
