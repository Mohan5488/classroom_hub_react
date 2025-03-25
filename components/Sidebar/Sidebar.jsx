import React from 'react';
import '../Sidebar/Sidebar.css';
import { IoIosHome } from 'react-icons/io';
import { GrNotes, GrTechnology } from 'react-icons/gr';
import { RiCalendarEventLine } from 'react-icons/ri';
import { LuMessageSquareMore } from 'react-icons/lu';
import { FaAngleRight, FaChalkboardTeacher, FaFileAlt, FaProjectDiagram } from 'react-icons/fa';
import { GiCardboardBox } from 'react-icons/gi';

const Sidebar = ({ setCategory, clicked }) => {
  
  const shortcutLinks = [
    { icon: <IoIosHome />, label: "Home", category:()=> setCategory(0) },
    { icon: <GrNotes />, label: "Notes", category: ()=>setCategory(1) },
    { icon: <RiCalendarEventLine />, label: "Events", category:()=> setCategory(2) },
    { icon: <LuMessageSquareMore />, label: "Announcements", category: ()=>setCategory(3) },
    { icon: <FaFileAlt />, label: "Assignments", category: ()=>setCategory(5) },
    { icon: <FaProjectDiagram />, label: "Projects", category: ()=>setCategory(6) },
    { icon: <FaChalkboardTeacher />, label: "Lectures", category: ()=>setCategory(7) },
    { icon: <GiCardboardBox />, label: "Lost Things", category: ()=>setCategory(8) },
    { icon: <GrTechnology />, label: "Technology", category: ()=>setCategory(9) },
  ];

  return (
    <>
      <section className='sidebar'>
        <div className="shortcut-links">
          {shortcutLinks.map((link, index) => (
            <div className="side-link" onClick={() => link.category()} key={index}>
              <span>{link.icon}</span>
              <p className='name'>{link.label}</p>
              <FaAngleRight className='arrow'/>
            </div>
          ))}
        </div>
      </section>

      <section className={`mobile-sidebar ${clicked ? 'expand' : 'collapse'}`}>
        <div className="shortcut-links">
          {shortcutLinks.map((link, index) => (
            <div className="side-link" onClick={() => link.category()} key={index}>
              <span>{link.icon}</span>
              <p className='name'>{link.label}</p>
              <FaAngleRight className='arrow'/>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Sidebar;
