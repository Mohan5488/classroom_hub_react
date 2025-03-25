import React, { useState, useEffect, useRef } from 'react';
import { FaHeart, FaRegComment, FaRegSave, FaSave } from 'react-icons/fa';
import { LuCircleUserRound } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { Skeleton, Card, CardContent, Button } from '@mui/joy';
import '../Feed/Feed.css';
import { FaBookBookmark, FaBookmark, FaRegBookmark } from 'react-icons/fa6';

const Feed = ({ category }) => {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [data, setData] = useState([]);  
  const [error, setError] = useState(null);  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
  const [message, setMessage] = useState(null)
  const dept = localStorage.getItem('dept');
  const year = localStorage.getItem('year');
  const token = localStorage.getItem('token')
  const [saved, SetSaved] = useState([])
  const [savedData, setSavedData] = useState([])

  const fetchSavedPosts = async () => {
    try {
        const response = await fetch(`https://classroom-hub.onrender.com/api/saved/?user=${localStorage.getItem('username')}`, {
            method: 'GET',
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch saved posts');
        }

        const d = await response.json();
        if(Array.isArray(d.data)){
          setSavedData(d.data);
          const savedPostIds = d.data.map(d => d.post.id);
          SetSaved(savedPostIds)
        }

    } catch (error) {
        console.log(error);
    }
};


  useEffect(() => {
    fetchSavedPosts();
}, []);

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



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://classroom-hub.onrender.com/api/feed/${dept}/${year}/${category}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dept, year, category]);

  const getSelectedPostId = (id) => {
    const savedPost = savedData.find(post => post.post.id === id);
    return savedPost ? savedPost.id : null;
  };

  const handleCommentClick = (postId) => {
    setSelectedPostId(postId);
    navigate(`/posts/${category}/${postId}`);
  }
  const handldeSavePost =async (id)=>{
    try{
      setLoading(true);

      if(!saved.includes(id)){
        const response = await fetch('https://classroom-hub.onrender.com/api/saved/',{
          method : "POST", 
          headers : {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
          },
          body : JSON.stringify({
            "post" : id,    
          })
        });
        if (!response.ok) {
          throw new Error('Failed to Save the post');
        }
        SetSaved((prev) => [...prev, id]);
      }else{
        const savedId = getSelectedPostId(id);
        const response = await fetch(`https://classroom-hub.onrender.com/api/saved/?id=${savedId}`,{
          method : "DELETE", 
          headers : {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
          },
        });
        if (!response.ok) {
          throw new Error('Failed to UNSAVE the post');
        }
        SetSaved((prev) => prev.filter(post => post!== id));
      }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="feed">
      {loading
        ?
          Array.from({ length: 1 }).map((_, index) => (
            <Card className="post" key={index} variant="outlined" sx={{ width: 800,height:700, marginBottom: 2 }}>
              <CardContent orientation="horizontal">
                <Skeleton animation="wave" variant="circular" width={48} height={48} />
                <div>
                  <Skeleton animation="wave" variant="text" sx={{ width: 120 }} />
                  <Skeleton animation="wave" variant="text" sx={{ width: 200 }} />
                </div>
              </CardContent>
              <Skeleton animation="wave" variant="rectangular" sx={{ height: 500 }} />
              <Button disabled>
                <Skeleton animation="wave" />
              </Button>
            </Card>
          ))
        : 
          data.map((post, index) => {
            const fileUrl = post.post_image ? `https://classroom-hub.onrender.com${post.post_image}` : null;
            const fileExtension = post.post_image ? post.post_image.split('.').pop().toLowerCase() : "";
            const isPDF = fileExtension === "pdf";


            return (
              <div key={post.id} className="post">
                <div className="post-header" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <div className="left-header" style={{display:"flex", justifyContent:"space-between"}}>
                    <LuCircleUserRound className='profile-pic' style={{marginRight : "10px",cursor:"pointer"}}/>
                    <p className='username' style={{cursor:"pointer"}}>{post.user.username}</p>
                  </div>
                  <div className="right-header">
                    <p onClick={() => handldeSavePost(post.id)}>
                      {saved.includes(post.id) ? <FaBookmark style={{marginRight : "30px", fontSize:"25px", cursor:"pointer"}} /> : <FaRegBookmark style={{marginRight : "30px",fontSize:"25px", cursor:"pointer"}} />}
                    </p>
                  </div>
                </div>
                <div className='post-title'>
                  <h3>{post.title}</h3>
                </div>
                <div className="post-media">
                {isPDF ? (
                  <iframe
                    style={{ border: "none" }}
                    src={fileUrl}
                    width="100%"
                    height={700}
                  ></iframe>
                ) : post.post_image ? ( 
                  <img className="post-image" src={fileUrl} alt="post" />
                ) : null}
                </div>
                <div className="post-actions">
                  <div className="action-left">
                    {/* <FaHeart className='like-icon' />
                    <p className='likes'>{post.likes}</p> */}
                    <FaRegComment className='comment-icon' onClick={() => handleCommentClick(post.id)} />
                    <p className='comments'>{post.comments_count}</p>
                  </div>
                  <div className="action-right" style={{marginRight:"30px", color:"gray", fontSize:"13px"}}>
                    {timeAgo(post.created_at)}
                  </div>
                </div>
                  <div className="description">
                    <p className='username'>{post.user.username}</p>
                    <div className='caption' dangerouslySetInnerHTML={{ __html: post.caption }} />
                  </div>
                </div>
            );
          })}
    </div>
  );
};

export default Feed;
