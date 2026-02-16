import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Auth from "./components/Auth";
import Register from "./components/Register";
import EventDescription from "./components/eventDes";
import Dashboard from "./components/Dashboard";
import RequestSpeaker from "./components/RequestSpeaker"
import Search from "./components/search"
import reportWebVitals from "./reportWebVitals"
import Calendar from "./components/Calendar";
import EditProfile from "./components/manageProfile";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminEvents from "./components/Admin/AdminEvents";
import Inbox from "./components/Inbox"
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/Base.css';

const router = createBrowserRouter([
  {
    path:'/',
    element: <LandingPage />
  },
  {
    path:'/login',
    element: <Auth />
  },
  {
    path:'/EditProfile',
    element: <EditProfile />
  },
  {
    path:'/Register',
    element: <Register />
  },
  {
    path:'/Dashboard',
    element: <Dashboard />
  },
  {
    path:'/events/:eventID',
    element: <EventDescription />
  },
  {
    path:'/inbox',
    element: <Inbox/>
  },
  {
    path:'/RequestSpeaker',
    element: <RequestSpeaker />
  },
  {
    path:'/Search',
    element: <Search />
  },
  {
    path:'/Calendar',
    element: <Calendar />
  },
  // Admin routes
  {
    path:'/admin/login',
    element: <AdminLogin />
  },
  {
    path:'/admin/dashboard',
    element: <AdminDashboard />
  },
  {
    path:'/admin/users',
    element: <AdminUsers />
  },
  {
    path:'/admin/events',
    element: <AdminEvents />
  }
])

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();