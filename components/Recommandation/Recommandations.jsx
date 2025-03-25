import React, { useState, useEffect } from 'react';
import '../Recommandation/Recommandations.css';
import { useNavigate } from 'react-router-dom';
import { LuCircleUserRound } from 'react-icons/lu';
import Skeleton from '@mui/joy/Skeleton';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';

const Recommandations = ({ category, postid }) => {
    const [selectedPostId, setSelectedPostId] = useState(null);
    const navigate = useNavigate();
    const [posts, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const dept = localStorage.getItem('dept');
    const year = localStorage.getItem('year');

    const timeAgo = (timestamp) => {
        const now = new Date();
        const postTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - postTime) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hr ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    };

    const fetchPostData = async () => {
        try {
            const response = await fetch(`https://classroom-hub.onrender.com/api/recommend/${dept}/${year}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const data = await response.json();
            setPost(data['data']);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostData();
    }, []);

    const handleChange = (postId) => {
        setSelectedPostId(postId);
        navigate(`/posts/${category}/${postId}`);
    };

    return (
        <div className='recommand'>
            <div className="box">
                {loading
                    ?
                      Array.from(new Array(4)).map((_, index) => (
                        <Card key={index} variant="outlined" sx={{ width: 300, mb: 2 }}>
                          <CardContent orientation="horizontal">
                            <Skeleton animation="wave" variant="circular" width={48} height={48} />
                            <Skeleton animation="wave" variant="text" sx={{ width: 120 }} />
                          </CardContent>
                          <Skeleton animation="wave" variant="text" sx={{ width: '90%', height: 20 }} />
                          <Skeleton animation="wave" variant="text" sx={{ width: '80%', height: 20 }} />
                        </Card>
                      ))
                    :
                      posts.map((link) => (
                        <div onClick={() => handleChange(link.id)} className="box-item" key={link.id}>
                            <div className="header">
                            <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                <LuCircleUserRound className="profile-pic" />
                                <p className='username'>{link.user.username}</p>
                            </div>
                            <p className="timestamp">{timeAgo(link.created_at)}</p>
                            </div>
                            <div className="post-title">
                                <p style={{marginLeft:"20px"}}>{link.title}</p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Recommandations;
