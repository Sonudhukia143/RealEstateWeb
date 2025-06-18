// src/components/RouteTracker.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addRoute } from "../redux/route/routeHistorySlice.js";

export default function RouteTracker() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addRoute(location.pathname));
  }, [location.pathname, dispatch]);

  return null;
}
