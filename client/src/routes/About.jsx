import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Container, Row, Col, Card, Carousel, Button } from "react-bootstrap";
import {
    PeopleFill,
    StarFill,
    LightningFill,
    GlobeAmericas,
    BootstrapFill,
    HeartFill,
    EmojiSmile,
    RocketTakeoff,
} from "react-bootstrap-icons";

export default function About() {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <div style={{ background: "#f9f9ff", minHeight: "100vh" }}>
            {/* Hero with subtle zoom background */}
            <div
                className="hero-zoom"
                style={{
                    backgroundImage: "linear-gradient(135deg, #0d6efd, #6f42c1)",
                    color: "white",
                    padding: "100px 0",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <GlobeAmericas size={60} className="mb-4 animate__animated animate__pulse animate__infinite" />
                <h1 className="display-3 fw-bold" data-aos="zoom-in">
                    Building The Future of Living
                </h1>
                <p className="lead" data-aos="fade-up" data-aos-delay="200">
                    Crafted with care. Driven by innovation. Trusted by Me.
                </p>
            </div>

            {/* Animated Stats with bounce-in */}

            {/* Animated Stats with bounce-in and beautiful background */}
            <section style={{ background: "linear-gradient(135deg, #f0f4ff, #e3e6ff)" }}>
                <Container className="py-5 text-center">
                    <h1
                        className="display-3 fw-bold gradient-text mb-4 animate__animated animate__fadeInDown"
                        data-aos="zoom-in"
                    >
                        Will Be One Day
                    </h1>
                    <p className="lead text-muted mb-5" data-aos="fade-up" data-aos-delay="200">
                        We dream big. This is just the beginning of something extraordinary.
                    </p>
                    <Row>
                        {[
                            { value: "1M+", label: "Listings Viewed", color: "text-primary" },
                            { value: "50K+", label: "Happy Users", color: "text-success" },
                            { value: "99.99%", label: "Server Uptime", color: "text-warning" },
                        ].map((stat, i) => (
                            <Col key={i} data-aos="zoom-in-up" data-aos-delay={i * 300}>
                                <h1 className={`fw-bold display-4 ${stat.color}`}>{stat.value}</h1>
                                <p className="text-muted fs-5">{stat.label}</p>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>



            {/* Mission / Vision / Values with slide-up */}
            <Container className="py-5">
                <Row className="text-center g-4">
                    {[
                        {
                            icon: LightningFill,
                            color: "text-warning",
                            title: "Our Mission",
                            desc: "Making real estate accessible & intelligent.",
                        },
                        {
                            icon: StarFill,
                            color: "text-primary",
                            title: "Our Vision",
                            desc: "Redefining how people find and sell homes worldwide.",
                        },
                        {
                            icon: HeartFill,
                            color: "text-danger",
                            title: "Our Values",
                            desc: "Honesty. User-First. Tech-Driven Innovation.",
                        },
                    ].map((section, i) => {
                        const Icon = section.icon;
                        return (
                            <Col key={i} data-aos="fade-up" data-aos-delay={i * 150}>
                                <Icon size={40} className={`${section.color} mb-2`} />
                                <h3 className="fw-bold">{section.title}</h3>
                                <p className="text-muted">{section.desc}</p>
                            </Col>
                        );
                    })}
                </Row>
            </Container>

            {/* Tech Stack with zoom-in */}
            <Container className="text-center my-5">
                <h2 className="fw-bold mb-4" data-aos="fade-down">
                    <BootstrapFill className="me-2 text-purple" />
                    Our Stack
                </h2>
                <Row className="justify-content-center g-4">
                    {["react", "nodejs", "mongodb", "bootstrap"].map((tech, i) => (
                        <Col xs={6} sm={3} md={2} key={tech} data-aos="zoom-in" data-aos-delay={i * 150}>
                            <Card className="p-3 shadow-sm border-0 bg-white rounded-4">
                                <img src={`/assets/${tech}.svg`} alt={tech} width={50} className="mx-auto" />
                                <p className="mt-2 fw-semibold">{tech.toUpperCase()}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Testimonial Carousel with fade */}
            <Container className="py-5">
                <h2 className="text-center fw-bold mb-5" data-aos="fade-up">
                    <EmojiSmile className="text-success me-2" /> What Users Say
                </h2>
                <Carousel data-aos="fade-up" data-aos-delay="200">
                    {[
                        {
                            quote: "This platform helped me rent my house in 2 days. Incredible tech!",
                            name: "Aisha Khan",
                        },
                        {
                            quote: "Love the clean UI, fast filters, and trusted listings. Highly recommended.",
                            name: "Rahul Verma",
                        },
                        {
                            quote: "Their support team is amazing. And listings are real!",
                            name: "Emily Cooper",
                        },
                    ].map((item, idx) => (
                        <Carousel.Item key={idx}>
                            <div className="text-center px-4">
                                <blockquote className="blockquote">
                                    <p className="mb-4 fst-italic">“{item.quote}”</p>
                                </blockquote>
                                <footer className="blockquote-footer">{item.name}</footer>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>

            {/* Glass CTA with zoom-in */}
            <div
                className="hero-section text-white d-flex align-items-center justify-content-center  p-4"
                style={{
                    background: "linear-gradient(135deg, #1e1e2f 0%, #2e3b55 100%)",
                    position: "relative",
                    minHeight: "80vh",
                    overflow: "hidden",
                }}
            >
                {/* Background Orbs */}
                <div className="animated-orbs"></div>

                {/* Main Glass Card */}
                <div
                    className="glass-card text-center p-5 animate__animated animate__fadeInUp"
                    style={{
                        backdropFilter: "blur(16px)",
                        background: "rgba(255, 255, 255, 0.07)",
                        borderRadius: "20px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        maxWidth: "700px",
                        zIndex: 2,
                    }}
                >
                    <RocketTakeoff
                        size={70}
                        className="mb-4 text-warning animate__animated animate__bounceIn"
                    />
                    <h2 className="fw-bold display-4 mb-3 text-light glow-text">Join Us On The Journey</h2>
                    <p className="fs-5 text-light">
                        We're just getting started. Come grow with us 🚀
                    </p>

                    <Button
                        variant="light"
                        size="lg"
                        className="glow-button mt-4 px-5 py-2 fw-bold"
                        onClick={() =>
                            window.open("mailto:jagdishdhukia770@gmail.com?subject=Interested in Joining&body=Hi team,", "_blank")
                        }
                    >
                        Connect With Us
                    </Button>
                </div>
            </div>


        </div>
    );
}
