import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Loader from "../../components/Loader";
import { LoginContext } from "../../helper/context";

const Show = ({ post }) => {
	const router = useRouter();

	const { loggedIn, setLoggedIn } = useContext(LoginContext);

	useEffect(async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/");
		} else {
			setLoggedIn(true);
		}
	}, []);

	const handleDeletePost = async () => {
		const res = await axios.delete(
			`${process.env.base_url}/api/posts/${post.id}`
		);
		const result = res.data;
		if (!result.error) {
			router.push("/posts");
			sessionStorage.setItem("message", result.message);
			sessionStorage.setItem("status", result.type);
		} else {
			console.log(result);
		}
	};
	if (!loggedIn) {
		return <Loader />;
	}
	return (
		<>
			<Head>
				<title>{post.title}</title>
			</Head>
			<div className="row my-4">
				<div className="col-md-10 mx-auto">
					<div className="card shadow">
						<img
							src={`${process.env.base_url}/images/${post.image}`}
							className="card-img-top img-fluid"
						/>
						<div className="card-body p-4">
							<div className="card-title fs-4 fw-bold text-secondary">
								{post.title}
							</div>
							<div className="badge bg-info mb-3">{post.category}</div>
							<p className="text-muted" suppressHydrationWarning>
								{new Date(post.created_at).toLocaleString()}
							</p>
							<p>{post.content}</p>
						</div>
						<div className="card-footer text-end">
							<Link href={`/edit/${post.id}`}>
								<a className="btn btn-success btn-sm">Edit Post</a>
							</Link>

							<button
								className="btn btn-danger btn-sm ms-2"
								onClick={() => handleDeletePost(post.id)}
							>
								Delete Post
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export async function getServerSideProps(context) {
	let id = context.query.id;
	const res = await axios.get(`${process.env.base_url}/api/posts/${id}`);
	const data = res.data;
	const post = data.post;
	if (data.error) {
		return {
			notFound: true,
		};
	} else {
		return {
			props: {
				post,
			},
		};
	}
}

export default Show;
