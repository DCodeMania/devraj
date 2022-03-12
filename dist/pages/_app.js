import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Layout from "../components/layout";
import { LoginContext } from "./../helper/context";

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		typeof document !== undefined
			? require("bootstrap/dist/js/bootstrap.bundle.min")
			: null;
	}, []);

	const [loggedIn, setLoggedIn] = useState(false);
	const [authUser, setAuthUser] = useState({});

	return (
		<LoginContext.Provider
			value={{ loggedIn, setLoggedIn, authUser, setAuthUser }}
		>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</LoginContext.Provider>
	);
}

export default MyApp;
