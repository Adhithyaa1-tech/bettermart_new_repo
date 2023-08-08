import React, { useState } from "react";
import "./Contact.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const { user, isAuthenticated, loading } = useSelector((state) => state.user);

  const handleSubmit = (e) => {

    e.preventDefault();
    
    if(!email || !message || !name) {
        toast.error("Please enter all the information");
        return;
    }

    if(email !== user.email || name !== user.name) {
        toast.error("Please enter Your Valid credentials");
        return;
    }

    toast.success("Thankyou!Your query has been received");
    navigate('/');

  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-field"
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default Contact;
