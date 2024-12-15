import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router";
import { Navi } from "./components/Navi";
import Home from "./pages/Home";
import Products from "./pages/Products";
import './index.css';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Account from "./pages/Account";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Navi />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vasarolj" element={<Products />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
