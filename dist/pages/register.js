import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Loader from "../components/Loader";
import { LoginContext } from "../helper/context";
const register = () => {
	const router = useRouter();

	const [nameError, setNameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPassError, setConfirmPassError] = useState("");

	const { loggedIn, setLoggedIn } = useContext(LoginContext);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setLoggedIn(true);
			router.push("/posts");
		}
	}, []);

	const handleRegister = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", e.target.name.value);
		formData.append("email", e.target.email.value);
		formData.append("password", e.target.password.value);
		formData.append("password_confirmation", e.target.confirmPass.value);

		const res = await axios.post(
			`${process.env.base_url}/api/auth/register`,
			formData
		);
		const result = res.data;
		if (result.validationError) {
			if (result.message.name) {
				setNameError(result.message.name);
			} else {
				setNameError("");
			}

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

			if (result.message.password) {
				setConfirmPassError(result.message.password);
			} else {
				setConfirmPassError("");
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
				<title>Register</title>
			</Head>
			<div className="row min-vh-100 justify-content-center align-items-center">
				<div className="col-lg-5">
					<div className="card shadow">
						<div className="card-header">
							<h1 className="text-secondary fw-bold">Register</h1>
						</div>
						<div className="card-body p-5">
							<form onSubmit={handleRegister} noValidate>
								<div className="mb-3">
									<label htmlFor="name">Name</label>
									<input
										type="text"
										name="name"
										id="name"
										className={`form-control ${
											nameError != "" ? "is-invalid" : ""
										}`}
									/>
									<div className="invalid-feedback">{nameError}</div>
								</div>

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

								<div className="mb-3">
									<label htmlFor="confirmPass">Password</label>
									<input
										type="password"
										name="confirmPass"
										id="confirmPass"
										className={`form-control ${
											confirmPassError != "" ? "is-invalid" : ""
										}`}
									/>
									<div className="invalid-feedback">{confirmPassError}</div>
								</div>

								<div className="d-grid mb-3">
									<button type="submit" className="btn btn-primary">
										Register
									</button>
								</div>

								<div className="text-center">
									Already registered?{" "}
									<Link href="/">
										<a className="text-decoration-none">Login</a>
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

export default register;
