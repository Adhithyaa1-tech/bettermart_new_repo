import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";


// const ProtectedRoute = ({ path, element }) => {
//  

//   return isAuthenticated ? (
//     <Route path={path} element={element} />
//   ) : (
//     <Navigate to="/login" replace />
//   );
// };

const PrivateRoute = (privateRouteProps, {isAdmin}) => {
  //change location to patprivateRouteProps we are sending path not location
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const {  children} = privateRouteProps;

  if (isAdmin === true && user.role !== "admin") {
    return<Navigate to="/login"></Navigate>;
  }

  
  return isAuthenticated ? children : <Navigate to="/login"></Navigate>;

};


export default PrivateRoute;


