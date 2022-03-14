import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Loader from "../components/Loader";
import { LoginContext } from "../helper/context";
const posts = ({ posts }) => {
	const router = useRouter();

	const { loggedIn, setLoggedIn } = useContext(LoginContext);
	const { authUser, setAuthUser } = useContext(LoginContext);

	const [message, setMessage] = useState([]);
	const [status, setStatus] = useState([]);

	useEffect(() => {
		setMessage(sessionStorage.getItem("message"));
		setStatus(sessionStorage.getItem("status"));

		sessionStorage.removeItem("message");
		sessionStorage.removeItem("status");

		const token = localStorage.getItem("token");
		setAuthUser(JSON.parse(localStorage.getItem("user")));
		if (!token) {
			router.push("/");
		} else {
			setLoggedIn(true);
		}
	}, []);

	if (!loggedIn) {
		return <Loader />;
	}
	return (
		<>
			<Head>
				<title>Full Stack App Laravel 9 and Next.js</title>
			</Head>
			<div className="row my-4 g-4">
				{message && (
					<div className={`alert alert-${status} fade show`} role="alert">
						<strong>{message}</strong>
					</div>
				)}

				{posts.map((post) => (
					<div className="col-lg-4" key={post.id}>
						<div className="card shadow">
							<Link href={`/show/${post.id}`}>
								<a>
									<img
										src={`${process.env.base_url}/images/${post.image}`}
										className="card-img-top img-fluid"
									/>
								</a>
							</Link>
							<div className="card-body p-4">
								<div className="card-title fs-4 fw-bold text-secondary">
									{post.title}
								</div>
								<div className="d-flex justify-content-between">
									<div className="small text-muted" suppressHydrationWarning>
										{new Date(post.created_at).toLocaleString()}
									</div>
									<div className="badge bg-info mb-3">{post.category}</div>
								</div>
								<p>
									{post.content.substring(0, 100)}...{" "}
									<Link href={`/show/${post.id}`} passHref>
										<a className="text-decoration-none">Read More</a>
									</Link>
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export async function getStaticProps() {
	const res = await axios.get(`${process.env.base_url}/api/posts`);
	return {
		props: {
			posts: res.data.posts,
		},
	};
}

export default posts;
