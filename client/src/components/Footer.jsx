import { Github, Linkedin, Envelope, Phone } from "react-bootstrap-icons";
import "../../styles/footer.css"; // Assuming your CSS is here

export default function Footer() {
    return (
        <footer className="footer-section text-white py-5">
            <div className="container text-center">
                <h4 className="mb-4 glow-text">Crafted with ❤️ by Sonu Dhukia</h4>
                <div className="d-flex justify-content-center gap-4 mb-3">
                    <a href="https://github.com/Sonudhukia143" target="_blank" rel="noreferrer" className="footer-icon-link">
                        <Github size={30} />
                    </a>
                    <a href="https://www.linkedin.com/in/sonu-dhukia-web770" target="_blank" rel="noreferrer" className="footer-icon-link">
                        <Linkedin size={30} />
                    </a>
                    <a href="mailto:jagdishdhukia770@gmail.com" className="footer-icon-link">
                        <Envelope size={30} />
                    </a>
                    <a href="tel:+919518803143" className="footer-icon-link">
                        <Phone size={30} />
                    </a>
                </div>
                <p className="text-light small mt-3">
                    © {new Date().getFullYear()} Sonu Dhukia. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
