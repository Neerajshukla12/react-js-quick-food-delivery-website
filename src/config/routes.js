import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../screens/Home";
import RegisterRestaurant from "../screens/RegisterRestaurant";
import Login from "../screens/Login";
import Restaurants from "../screens/Restaurants";
import RestaurantDetails from "../screens/RestaurantDetails";
import AddMenuItems from "../screens/AddMenuItems";
import OrderRequests from "../screens/OrderRequests";
import MyOrders from "../screens/MyOrders";
import MyFoods from "../screens/MyFoods";

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-restaurant" element={<RegisterRestaurant />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurant-details" element={<RestaurantDetails />} />
        <Route path="/add-menu-items" element={<AddMenuItems />} />
        <Route path="/order-requests" element={<OrderRequests />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/my-foods" element={<MyFoods />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MyRoutes;
