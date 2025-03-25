import React from "react";
import "./HomePage.css";
import Contact from "./Contact";

const HomePage = () => {
  return (
    <div>
      <div className="front"></div>
      {/* About Section */}
      <section className="about">
        <h2>About Classroom Hub</h2>
        <p>
          The Classroom Hub is a centralized web-based platform designed to streamline classroom discussions, event coordination, 
          and knowledge sharing within colleges. It fosters collaboration among students and faculty by providing a structured, 
          distraction-free learning environment.
        </p>
      </section>

      {/* Main Features Section */}
      <section className="features">
        <h2>Main Features</h2>
        <ul>
          <li><strong>Academic Collaboration:</strong> Students can ask questions, share notes, and engage in discussions.</li>
          <li><strong>Seamless Event Management:</strong> Simplified college event discovery and reminders.</li>
          <li><strong>Verified Learning Resources:</strong> Faculty moderates and verifies academic content.</li>
          <li><strong>Interactive Community Engagement:</strong> Study groups, announcements, and structured communication.</li>
          <li><strong>Distraction-Free Experience:</strong> Unlike social media, this platform offers a focused academic space.</li>
        </ul>
      </section>

      <Contact />
      {/* Footer Section */}
      <footer className="footer">
        <p>© 2025 Classroom Hub | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default HomePage;
