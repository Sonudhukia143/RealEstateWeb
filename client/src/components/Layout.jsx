import { Outlet } from "react-router-dom";
import NavBar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
    return (
        <>
            <header>
                <NavBar />
            </header>
            <main className="main-content-wrapper">
                <Outlet />
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    )
}