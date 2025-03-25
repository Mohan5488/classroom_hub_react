import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Posts/Posts.css';
import { LuCircleUserRound } from 'react-icons/lu';
import { MdDeleteOutline } from "react-icons/md";
import { CircularProgress } from '@mui/joy';
import { DeleteForeverTwoTone } from '@mui/icons-material';
import { RiDeleteBinLine } from "react-icons/ri";
import { motion } from "framer-motion";
const Posts = ({}) => {
  const { category, postid } = useParams();
  const [showTooltip, setShowTooltip] = useState(false);
  const [post, setPost] = useState(null);
  const [writeComment, setComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const navigate = useNavigate()
  // const [editingCommentId, setEditingCommentId] = useState(null);
  // const [editedContent, setEditedContent] = useState('');

  
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  const fetchPostData = async () => {
    const response = await fetch(`http://localhost:8000/api/post-view/?id=${postid}`,{
      method: 'GET',
    })
    if(!response.ok){
      throw new Error('Failed to fetch');
    }
    const data = await response.json();
    setPost(data[0]);
  };

  useEffect(() => {
    fetchPostData();
  }, [postid]);

  if (!post) {
    return <div style={{width:"100%", height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}><CircularProgress size="lg" /></div>;
  }

  const handleCommentSubmit =async ()=>{
    const response = await fetch(`http://localhost:8000/api/add-comment/?id=${postid}`,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body : JSON.stringify({
        "post" : postid,
        "content" : writeComment,
        // "user" : {
        //   username
        // }

      })
    });
    if(!response.ok){
      throw new Error('Failed to add comment');
    }
    const data = await response.json();
    await fetchPostData()
    setComment('');
  }
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/add-comment/?id=${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete comment');
      await fetchPostData();
    } catch (error) {
      alert(error.message);
    }
  };
  // const handleReply = (commentId) => {
  //   setReplyingTo((prev) => (prev === commentId ? null : commentId));
  // };

  const handleReplySubmit = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/add-comment/?id=${commentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          "post": postid,
          "content": replyContent,
          // "user": {
          //   username
          // },
          "parent": commentId,
        }),
      });

      if (!response.ok) throw new Error('Failed to add reply');
      await fetchPostData();

      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      alert(error.message);
    }
  }

  const handleDeletePost = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:8000/api/post-view/?id=${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete the post');
      }
  
      alert("Post deleted successfully!");
      // Redirect or update state accordingly
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    }
  };
  

  // const handleDeleteReply = async (replyId) => {
  //   try {
  //     const response = await fetch(`http://localhost:8000/api/add-comment/?id=${replyId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Token ${token}`,
  //       },

  //     });

  //     if (!response.ok) throw new Error('Failed to delete reply');
  //     await fetchPostData();
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // }

  // const handleEditClick = (commentId, content) => {
  //   setEditingCommentId(commentId);
  //   setEditedContent(content);
  // };

  // const handleEditSubmit = async (commentId) => {
  //   try {
  //     const response = await fetch(`http://localhost:8000/api/add-comment/?id=${commentId}`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Token ${token}`,
  //       },
  //       body: JSON.stringify({
  //         id: commentId,
  //         content: editedContent,
  //       }),
  //     });

  //     if (!response.ok) throw new Error('Failed to edit comment');
  //     await fetchPostData();
  //     setEditingCommentId(null);
  //     setEditedContent('');
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  const fileExtension = post.post_image? post.post_image.split('.').pop().toLowerCase():null;
  const isPDF = fileExtension === 'pdf';
  const fileUrl = post.post_image? `http://localhost:8000${post.post_image}`:null;

  const renderComments = (comments, depth = 0) => {
    return comments.map((comment) => (
      <div key={comment.id} className="comment" style={{ marginLeft: `${depth * 20}px`, borderLeft: depth > 0 ? "1px solid #CCC" : "none", paddingLeft: "10px" }}>
        <p>
          <strong>{comment.user.username}</strong>: {comment.content}
        </p>

        <div>
          <button onClick={() => setReplyingTo(comment.id)}>Reply</button>
          {username === comment.user.username && (
            <button onClick={() => handleDeleteComment(comment.id)}>
              <MdDeleteOutline />
            </button>
          )}
        </div>

        {replyingTo === comment.id && (
          <div style={{ marginLeft: "20px" }}>
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleReplySubmit(comment.id);
                  setReplyingTo(null);
                  setReplyContent("");
                }
              }}
            />
            <button onClick={() => {
              handleReplySubmit(comment.id);
              setReplyingTo(null);
              setReplyContent("");
            }}>
              Submit
            </button>
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
      </div>
    ));
  };

  return (
    <>
      <div className="post-detail">
          <div className="post-image">
            {isPDF ? (
              <iframe style={{ border: "none" }} src={fileUrl} width="100%" height={700}></iframe>
            ) : post.post_image ? (
              <img className="post-image" src={fileUrl} alt="post" />
            ) : (
              <div className="placeholder">
                <p>No Image Available</p>
              </div>
            )}
          </div>

        <div className="comment-section">
          <div className="header">
            <div className="profile-section">
              <LuCircleUserRound className="profile-pic" />
              <p className="username">{post.user.username}</p>
              {post.user.username === localStorage.getItem('username') &&  <div className="delete-container">
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="tooltip"
              >
                Delete Post
              </motion.div>
            )}
            <RiDeleteBinLine
              className="delete-icon"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => handleDeletePost(post.id)}
            />
          </div>}
            </div>
          </div>
          <div className="comments-section">
            <h3>Comments:</h3>
            {renderComments(post.comments)}
          </div>
 
          <div className="description-section">
            <p><strong>{post.user.username}</strong></p>
            <div className='caption' style={{fontSize:"12px"}} dangerouslySetInnerHTML={{ __html: post.caption }} />
            <input type="text" placeholder='Your comment' onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCommentSubmit();
                }
              }} value={writeComment} onChange={(e)=>setComment(e.target.value)}  />
            <input type="submit" onClick={handleCommentSubmit} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Posts;
