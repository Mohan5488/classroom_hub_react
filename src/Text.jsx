import React from 'react'
import './text.css'
const Text = ({title, Description}) => {
  return (
    <div className="text">
        <h2>{title}</h2>
        <h1>{Description}</h1>
    </div>
  )
}

export default Text