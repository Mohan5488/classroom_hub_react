import React, { useEffect, useState } from 'react';
import '../../components/PostsView/PostsView.css';
import { useNavigate } from 'react-router-dom';

const SavedPostView = () => {
    const [data, setData] = useState([]);
    const [links, setLinks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [hoveredPost, setHoveredPost] = useState(null);
    const [postClick, setPostClick] = useState(true);
    const [linkClick, setLinkClick] = useState(false);
    const navigate = useNavigate();

    const username = localStorage.getItem('username');
    const BASE_URL = "http://localhost:8000";

    useEffect(() => {
        if (username) {
            fetchPosts(username);
        }
    }, [username]);

    const fetchPosts = async (username) => {
        const authToken = localStorage.getItem('token'); 
        if (!authToken) {
            setError("No authentication token found. Please log in.");
            return;
        }
        try {
            setLoading(true);
            setError('');
            const response = await fetch(`${BASE_URL}/api/saved/?user=${username}`, {
                method: 'GET',
                headers: { 
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch posts data');
            }

            const postsData = await response.json();
            const filteredData = postsData.data.filter(post => post.post.post_image);
            setLinks(postsData.data.filter(post => !post.post.post_image));
            setData(filteredData.reverse());
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (postId) => {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
            setError("No authentication token found. Please log in.");
            return;
        }
        try {
            setLoading(true);
            setError('');

            const response = await fetch(`${BASE_URL}/api/saved/?id=${postId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            setData((prevData) => prevData.filter(post => post.id !== postId));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const isPDF = (file) => file && file.toLowerCase().endsWith('.pdf');

    return (
        <div className='container post-container'>
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"40px"}}>
                <h2 className='heading' style={{marginRight:"10px", cursor:"pointer"}} onClick={() => {
                    setLinkClick(false);
                    setPostClick(true);
                }} >Posts View</h2> <p>|</p>
                <h2 className='heading'  style={{marginLeft:"10px", cursor:"pointer"}} onClick={() => {
                    setPostClick(false);
                    setLinkClick(true);
                }}>Links</h2>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {postClick && (
                <div className="grid-container">
                    {data.length > 0 ? (
                        data.map((p) => (
                            <div 
                                className="post-box" 
                                key={p.post.id} 
                                onMouseEnter={() => setHoveredPost(p.id)}
                                onMouseLeave={() => setHoveredPost(null)}
                            >
                                {p.post.post_image ? (
                                    isPDF(p.post.post_image) ? (
                                        <div className="pdf-wrapper" style={{ pointerEvents: 'none' }}>
                                            <iframe 
                                                src={`${BASE_URL}${p.post.post_image}`} 
                                                className="post-content pdf-iframe"
                                                title={`PDF-${p.post.id}`}
                                                onClick={() => navigate(`/posts/${p.post.category}/${p.post.id}`)}
                                            ></iframe>
                                        </div>
                                    ) : (
                                        <img 
                                            src={`${BASE_URL}${p.post.post_image}`} 
                                            alt="Post" 
                                            className="post-content"
                                            onClick={() => navigate(`/posts/${p.post.category}/${p.post.id}`)}
                                        />
                                    )
                                ) : (
                                    <div className="placeholder">No Post Available</div>
                                )}

                                {hoveredPost === p.id && (
                                    <button 
                                        className="delete-button" 
                                        onClick={() => deletePost(p.id)}
                                    >
                                        ❌ Delete
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        !loading && <p>No posts available</p>
                    )}
                </div>
            )}

            {linkClick && (
                <div className="links-container">
                    {links.length > 0 ? (
                        links.map((link) => (
                            <div className="link-item" key={link.post.id} onClick={() => navigate(`/posts/${link.post.category}/${link.post.id}`)}>
                                🔗 {link.post.title}
                            </div>
                        ))
                    ) : (
                        !loading && <p>No links available</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SavedPostView;
