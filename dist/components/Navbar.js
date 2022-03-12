import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../helper/context";

const Navbar = () => {
	const router = useRouter();

	const { loggedIn, setLoggedIn } = useContext(LoginContext);
	const { authUser, setAuthUser } = useContext(LoginContext);

	const logout = async () => {
		const token = localStorage.getItem("token");
		try {
			const res = await axios.post(
				`${process.env.base_url}/api/logout`,
				{},
				{
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!res.data.error) {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				router.push("/");
				setLoggedIn(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			const user = JSON.parse(localStorage.getItem("user"));
			setAuthUser(user);
		}
	}, []);

	// console.log(authUser);
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container">
				<a className="navbar-brand" href="#">
					DCodeMania
				</a>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto">
						<li className="nav-item">
							<Link href="/">
								<a
									className={`nav-link ${
										router.pathname == "/" ? "active" : ""
									}`}
								>
									Home
								</a>
							</Link>
						</li>

						<li className="nav-item">
							<Link href="/create">
								<a
									className={`nav-link ${
										router.pathname == "/create" ? "active" : ""
									}`}
								>
									Create New Post
								</a>
							</Link>
						</li>

						{loggedIn && (
							<li className="nav-item dropdown">
								<a
									className="nav-link dropdown-toggle"
									href="#"
									id="navbarDropdown"
									role="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									{authUser ? authUser.name : "User"}
								</a>
								<ul className="dropdown-menu" aria-labelledby="navbarDropdown">
									<li>
										<a
											className="dropdown-item"
											href="#"
											onClick={() => logout()}
										>
											Logout
										</a>
									</li>
								</ul>
							</li>
						)}

						{/* {loggedIn && (
							// <li className="nav-item">
							// 	
							// 		<a href="#" className="nav-link" onClick={() => logout()}>
							// 			Logout
							// 		</a>
							// 	
							// </li>
						)} */}
					</ul>
				</div>
			</div>
		</nav>
	);
};

// export async function getServerSideProps(context) {
// 	// const token = localStorage.getItem("token");
// 	// const res = await axios.get(`${process.env.base_url}/api/profile`, {
// 	// 	headers: {
// 	// 		Accept: "application/json",
// 	// 		Authorization: `Bearer ${token}`,
// 	// 	},
// 	// });
// 	// const user = res.data;

// 	return {
// 		props: {
// 			user: "HEllo",
// 		},
// 	};
// }

export default Navbar;
