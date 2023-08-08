import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import './Profile.css'

const Profile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    !isAuthenticated ? navigate('/login') : navigate('/account');
  }, [navigate, isAuthenticated]);


  

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="profileContainer">
          <div>
            <h1>My Profile</h1>
            <img src={user.avatar.url} alt="profile-pic" />
            <Link to="/me/update">Edit Profile</Link>
          </div>
          <div>
            <div>
              <h4>Full Name</h4>
              <p>{user.name}</p>
            </div>
            <div>
              <h4>Email</h4>
              <p>{user.email}</p>
            </div>
            <div>
              <Link to="/orders">My Orders</Link>
              <Link to="/password/update">Change Password</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
