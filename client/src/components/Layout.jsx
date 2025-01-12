import { Outlet } from "react-router-dom";
import NavBar from "../routes/Navbar";

export default function Layout() {
    return (
        <>
            <div className="site-wrapper">
                <header>
                    <NavBar />
                </header>
                <main className="main-content-wrapper">
                    <Outlet />
                </main>
            </div>
            <footer>

            </footer>
        </>
    )
}