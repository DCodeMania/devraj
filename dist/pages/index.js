import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Loader from "../components/Loader";
import { LoginContext } from "../helper/context";
import Link from "next/link";
const index = () => {
	const router = useRouter();

	const [message, setMessage] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const { loggedIn, setLoggedIn } = useContext(LoginContext);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setLoggedIn(true);
			router.push("/posts");
		}
	}, []);

	const handleLogin = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("email", e.target.email.value);
		formData.append("password", e.target.password.value);

		const res = await axios.post(
			`${process.env.base_url}/api/auth/login`,
			formData
		);
		const result = res.data;
		if (result.credError) {
			setMessage(result.message);
			setEmailError("");
			setPasswordError("");
		} else if (result.validationError) {
			if (result.message.email) {
				setEmailError(result.message.email);
			} else {
				setEmailError("");
			}

			if (result.message.password) {
				setPasswordError(result.message.password);
			} else {
				setPasswordError("");
			}
		} else {
			localStorage.setItem("token", result.data.token);
			localStorage.setItem("user", JSON.stringify(result.data.user));
			router.push("/posts");
			setLoggedIn(true);
		}
	};

	if (loggedIn) {
		return <Loader />;
	}
	return (
		<>
			<Head>
				<title>Full Stack App Laravel 9 and Next.js</title>
			</Head>
			<div className="row min-vh-100 justify-content-center align-items-center">
				<div className="col-lg-5">
					<div className="card shadow">
						<div className="card-header">
							<h1 className="text-secondary fw-bold">Login</h1>
						</div>
						<div className="card-body p-5">
							{message != "" ? (
								<div className={`alert alert-danger fade show`} role="alert">
									<strong>{message}</strong>
								</div>
							) : (
								""
							)}
							<form onSubmit={handleLogin} noValidate>
								<div className="mb-3">
									<label htmlFor="email">E-mail</label>
									<input
										type="email"
										name="email"
										id="email"
										className={`form-control ${
											emailError != "" ? "is-invalid" : ""
										}`}
									/>
									<div className="invalid-feedback">{emailError}</div>
								</div>

								<div className="mb-3">
									<label htmlFor="password">Password</label>
									<input
										type="password"
										name="password"
										id="password"
										className={`form-control ${
											passwordError != "" ? "is-invalid" : ""
										}`}
									/>
									<div className="invalid-feedback">{passwordError}</div>
								</div>

								<div className="d-grid mb-3">
									<button type="submit" className="btn btn-primary">
										Login
									</button>
								</div>

								<div className="text-center">
									New user?{" "}
									<Link href="/register">
										<a className="text-decoration-none">Register</a>
									</Link>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default index;
