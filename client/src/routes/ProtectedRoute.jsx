import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const user = useSelector(state => state.user?.currentUser?.user);

  return (
    user
    ?
    <Outlet />
    :
    <Navigate to="/" />
  );
}
