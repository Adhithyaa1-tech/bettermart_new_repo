import React, { useEffect } from "react";
import Sidebar from "./Sidebar.js";
import "./Dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    ChartOptions,
    ArcElement
    } from 'chart.js';
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/adminProducts.js";
// import { getAllOrders } from "../../actions/orderAction.js";
// import { getAllUsers } from "../../actions/userAction.js";
// import MetaData from "../layout/MetaData";

// import { CategoryScale } from 'chart.js';




const Dashboard = () => {
  const dispatch = useDispatch();

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    ArcElement
   );

//   Chart.register(CategoryScale);



  const { products } = useSelector((state) => state.products);
  console.log('products', products);
  let outOfStock = 0;



//   const { orders } = useSelector((state) => state.allOrders);

  // const { users } = useSelector((state) => state.allUsers);




  products &&
    products.forEach((item) => {
      if (item.stock === 0) {
        outOfStock = outOfStock + 1;
      }
    });

  useEffect(() => {
    dispatch(getAdminProduct());
    // dispatch(getAllOrders());
    // dispatch(getAllUsers());

  }, [dispatch]);

//   let totalAmount = 0;
//   orders &&
//     orders.forEach((item) => {
//       totalAmount += item.totalPrice;
//     });

// const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Chart.js Line Chart',
//       },
//     },
//   };

const labels = ["Initial Amount", "Amount Earned"];
  const lineState = {
    labels,

    datasets: [
        {
            label: 'Dataset 1',
            data: [0, 4000],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  return (
    <div className="dashboard">
      {/* <MetaData title="Dashboard - Admin Panel" /> */}
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>
              {/* Total Amount <br /> ₹{totalAmount} */}
              Total Amount
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{products && products.length}</p>
              
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              {/* <p>{orders && orders.length}</p> */}
              <p>10</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              {/* <p>{users && users.length}</p> */}
              <p>4</p>
            </Link>
          </div>
        </div>

        <div className="lineChart">
          <Line  data={ lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;