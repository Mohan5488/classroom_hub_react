import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Feed from "../components/Feed/Feed.jsx";
import "../pages/Dashboard.css";
import Recommandations from "../components/Recommandation/Recommandations.jsx";

const Dashboard = ({ category }) => {
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();



  const [count, setCount] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const timer = setTimeout(() => {
      if (!token) {
        navigate('/');
      }
    }, 5000);
  
    return () => clearTimeout(timer); 
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  

  useEffect(() => {
    const fetchMainData = async () => {
      try {
        const response = await fetch("https://classroom-hub.onrender.com/api/dashboard/", {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
        } else {
          setMessage("Unauthorized! Please log in.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("An error occurred.");
      }
    };

    if (token) {
      fetchMainData();
    }
  }, [token]);

  if (!token) {
    return (
      <div className="alert alert-danger" role="alert">
        Unauthorized! Redirecting to login... with in {count} seconds
      </div>
    );
  }

  return (
    <div className="container">
      <Feed category={category} />
      <Recommandations category={category} />
    </div>
  );
};

export default Dashboard;
