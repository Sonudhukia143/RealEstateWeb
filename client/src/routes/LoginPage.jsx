export default function SignUp() {
    return (
        <>
            <div className="log-in-form-wrapper">
                <form className="log-in-form">
                    <h1>Login</h1>
                    <br/>
                    <span className="login-image">
                        <img src="/assets/loginlogo.webp" className="login-image"/>
                    </span>
                    <br/>
                    <div>
                    <span className="row mb-3">
                        <label htmlFor="email" className="col-sm-12 col-form-label">Email</label>
                        <span className="col-sm-12">
                            <input type="email" className="form-control" id="email" required/>
                        </span>
                    </span>
                    <span className="row mb-3">
                        <label htmlFor="password" className="col-sm-12 col-form-label">Password</label>
                        <span className="col-sm-12">
                            <input type="password" className="form-control" id="password" required/>
                        </span>
                    </span>
                    </div>
                    <button type="submit" className="btn btn-primary">Sign in</button>
                </form>
            </div>
        </>
    )
}