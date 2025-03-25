import React, { useState , useEffect} from 'react';
import { FaUpload, FaUserCircle } from 'react-icons/fa';
import '../CreatePost/CreatePost.css'

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState('');
  const [caption, setCaption] = useState('');
  const [links, setLinks] = useState(['', '', '']);
  const [message, setMessage] = useState('');

  const username = localStorage.getItem('username');
  const department = localStorage.getItem('dept');
  const year = localStorage.getItem('year');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleLinksChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };
  useEffect(() => {
    if (message) {
      const interval = setTimeout(() => {
        setMessage('');
      }, 2000);
      return () => clearTimeout(interval);
    }
  }, [message]);

  const formatLinksToHTML = (linksArray) => {
    return linksArray
      .filter((link) => link.trim() !== '')
      .map((link) => {
        const formattedLink = link.startsWith('http://') || link.startsWith('https://') 
          ? link 
          : `https://${link}`;
        return `<a href="${formattedLink}" target="_blank" rel="noopener noreferrer">${formattedLink}</a>`;
      })
      .join('<br>');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryMapping = {
      "Notes": 1, "Events": 2, "Announcements": 3,
      "Assignments": 5, "Projects": 6, "Lectures": 7, "Lost Things":8, "Technology" : 9
    };
    const categoryID = categoryMapping[category] || 0;

    const linksHTML = formatLinksToHTML(links);
    const finalCaption = caption + (linksHTML ? `<br>Links:<br>${linksHTML}` : "");

    console.log(finalCaption); // Debugging

    const formData = new FormData();
    formData.append('user', JSON.stringify({ username })); 
    formData.append('title', title);
    formData.append('caption', finalCaption);
    formData.append('category', categoryID); 
    formData.append('department', department);
    formData.append('year', year);
    if (file) formData.append('post_image', file);

    try {
      const response = await fetch('http://localhost:8000/api/upload-post/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      setMessage("Post uploaded successfully!");
      setTitle('');
      setCaption('');
      setCategory('');
      setLinks(['', '', '']);
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Upload Error:', error);
      setMessage('Error uploading post');
    }
  };

  return (
    <div className="container center">
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="left-section">
          <FaUserCircle className="profile-icon" />
          <div className="user-info">
            <label>Username</label>
            <input type="text" value={username} readOnly />
  
            <label>Department</label>
            <input type="text" value={department} readOnly />
  
            <label>Year</label>
            <input type="text" value={year} readOnly />
          </div>
        </div>
        <div className="right-section">
          <h2>Create a Post</h2>
  
          <label>Post Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
  
          <label>Caption</label>
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} required />
  
          <label>Links (optional)</label>
          {links.map((link, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Link ${index + 1}`}
              value={link}
              onChange={(e) => handleLinksChange(index, e.target.value)}
            />
          ))}
  
          <label className="upload-label">
            <FaUpload /> Upload Image or PDF
            <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
          </label>
  
          {preview && (
            <div className="file-preview">
              {file && file.type === 'application/pdf' ? (
                <p>📄 {file.name}</p>
              ) : (
                <img src={preview} alt="Preview" />
              )}
            </div>
          )}
  
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Notes">Notes</option>
            <option value="Events">Events</option>
            <option value="Announcements">Announcements</option>
            <option value="Technology">Technology</option>
            <option value="Assignments">Assignments</option>
            <option value="Projects">Projects</option>
            <option value="Lectures">Lectures</option>
            <option value="Lost Things">Lost Things</option>
          </select>
          
          <button type="submit">Post</button>
          {message && <div className="message">{message}</div>}
        </div>
      </form>

    </div>
  );
  
};

export default PostForm;
