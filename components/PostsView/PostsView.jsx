import React, { useEffect, useState } from 'react';
import '../PostsView/PostsView.css';
import { useNavigate } from 'react-router-dom';

const PostsView = () => {
    const [data, setData] = useState([]);
    const [links, setLinks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [postClick, setPostClick] = useState(true)
    const [linkCLick, setLinkCLick] = useState(false)

    const handleNavigate = (category, postId) => {
        navigate(`/posts/${category}/${postId}`);
    };

    const username = localStorage.getItem('username');
    const BASE_URL = "https://classroom-hub.onrender.com";

    useEffect(() => {
        if (username) {
            fetchPosts(username);
        }
    }, [username]);

    const fetchPosts = async (username) => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch(`${BASE_URL}/api/display/${username}/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch posts data');
            }

            const postsData = await response.json();
            const filteredData = postsData.data.filter(post => post.post_image);
            setLinks(postsData.data.filter(post => !post.post_image));
            setData(filteredData.reverse())
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const isPDF = (file) => file && file.toLowerCase().endsWith('.pdf');

    return (
        <div className='container post-container'>
            <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <h2 className='heading' style={{marginRight:"10px",cursor:"pointer"}} onClick={(prev) => {
                setLinkCLick(!prev);
                setPostClick(true);
            }}>Posts View</h2> <p>|</p>
            <h2 className='heading'  style={{marginLeft:"10px",cursor:"pointer"}} onClick={(prev) =>{
                setPostClick(!prev);
                setLinkCLick(true);
            }}>Links</h2>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {postClick && (
                <div className="grid-container">
                    {data.length > 0 ? (
                        data.map((post) => (
                            <div className="post-box" key={post.id} onClick={() => handleNavigate(post.category, post.id)}>
                                {post.post_image ? (
                                    isPDF(post.post_image) ? (
                                        <div className="pdf-wrapper">
                                            <iframe
                                                src={`${BASE_URL}${post.post_image}`}
                                                className="post-content pdf-iframe"
                                                title={`PDF-${post.id}`}
                                            ></iframe>
                                        </div>
                                    ) : (
                                        <img src={`${BASE_URL}${post.post_image}`} alt="Post" className="post-content" />
                                    )
                                ) : (
                                    <div className="placeholder">No Post Available</div>
                                )}
                            </div>
                        ))
                    ) : (
                        !loading && <p>No posts available</p>
                    )}
                </div>
            )}

            {linkCLick && (
                <div className="links-container">
                    {links.length > 0 ? (
                        links.map((link) => (
                            <div className="link-item" key={link.id} onClick={() => handleNavigate(link.category, link.id)}>
                                🔗 {link.title}
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

export default PostsView;
