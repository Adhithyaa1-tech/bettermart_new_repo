import React, { useState } from "react";
// import "../Header.css";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../actions/userAction";
import { useDispatch } from "react-redux";
import './UserOptions.css'
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearCartItems } from "../../../actions/cartAction";



const UserOptions = ({user}) => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const options = [
    {icon:<ListAltIcon/>, name: 'Orders', func: orders},
    {icon: <PersonIcon/>, name: 'Profile', func: account},
    {icon: <ExitToAppIcon/>, name: 'Logout', func: logoutUser},
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
  ];

  if(user.role === 'admin') {
    options.unshift({
      icon: <DashboardIcon/>,
      name: 'Dashboard',
      func: dashBoard
    })
  }

  function dashBoard(){
    navigate('/admin/dashboard');
  }

  function orders() {
    navigate('/orders');
  }

  function account() {
    navigate('/account');
  }

  function cart() {
    navigate("/cart");
  }

  const generateSuccess = () => {
    toast.success("logged out Successfully");
  }

  function logoutUser() {
    navigate('/');
   
    console.log('logged out');
    dispatch(logout());

    generateSuccess();
    dispatch(clearCartItems());
   
   
  }
  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial tooltop example"
        onClose={() => setOpen(false)}
        onOpen = {() => setOpen(true)}
        open = {open}
        icon = {<img className="speedDialIcon" src={user.avatar.url} alt = 'Profile'/>}
        direction="down"
        className="speedDial"
        tooltipTitle={window.innerWidth <= 600 ? true : false}
      >

        {/* <SpeedDialAction icon={<DashboardIcon/>} tooltipTitle="Dashboard"/> */}

        {options.map((item) => (
          <SpeedDialAction icon={item.icon} tooltipTitle={item.name} onClick ={item.func}/>
        ))}
        

      </SpeedDial>

      <ToastContainer/>
    </>
  );
};

export default UserOptions;
