import Box from "../helperComponents/Box.jsx";

export default function Home() {
    return (
        <>
            <div className="mainDiv">
                <div className="leftDiv">
                    <h1 style={{ color: "grey" }}>FIND YOUR HOMES ALL <b style={{ color: "lightgrey" }}>AROUND</b> THE GLOBE
                        <button><a href="#">Start Here...</a></button>
                    </h1>
                </div>
                <div className="rightDiv">

                </div>
            </div>
            <div className="properties">
                <span className="offers">
                    <h3>Recent offers</h3>
                    <p><a href="#">Show more offers</a></p>
                    <span className="boxes">
                        <Box />
                        <Box />
                        <Box />
                        <Box />
                    </span>
                </span>
                <span className="offers">
                    <h3>Recent places for rent</h3>
                    <p><a href="#">Show more places for rent</a></p>
                    <span className="boxes">
                        <Box />
                        <Box />
                        <Box />
                        <Box />

                    </span>
                </span>
                <span className="offers">
                    <h3>Recent places for sale</h3>
                    <p><a href="#">Show more places for sale</a></p>
                    <span className="boxes">
                        <Box />
                        <Box />
                        <Box />
                        <Box />

                    </span>
                </span>
            </div>
        </>
    )
}