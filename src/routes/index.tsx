import { createBrowserRouter } from "react-router-dom";
import OrderHistoryPage from "../pages/order-history";
import HomePage from "../pages/home";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import CartPage from "../pages/cart";
import CheckoutPage from "../pages/checkout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/order-history",
    element: <OrderHistoryPage />,
  },
]); 