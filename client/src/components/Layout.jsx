import { Outlet } from "react-router-dom";
import NavBar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import FlashMessage from "../helperComponents/FlashMessage.jsx";
import { useSelector } from "react-redux";

export default function Layout() {
    const flashMessage = useSelector(state => state.flash);

    return (
        <>
            <header>
                <NavBar />
            </header>
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