import { Outlet } from "react-router-dom";
import NavBar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import FlashMessage from "../helperComponents/FlashMessage.jsx";
import { useSelector } from "react-redux";
import FloatingBackButton from "../helperComponents/FloatingButton.jsx";
import RouteTracker from "../helperComponents/RouteTracker.jsx";

export default function Layout() {
    const flashMessage = useSelector(state => state.flash);

    return (
        <>
            <header>
                <NavBar />
            </header>
            <FloatingBackButton />
            <RouteTracker />
            {flashMessage?.message && <FlashMessage message={flashMessage.message} type={flashMessage.type} />}
            <main className="main-content-wrapper">
                <Outlet />
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    )
}