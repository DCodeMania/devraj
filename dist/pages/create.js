import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Loader from "../components/Loader";
import { LoginContext } from "../helper/context";
const Create = () => {
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

	const [titleError, setTitleError] = useState("");
	const [categoryError, setCategoryError] = useState("");
	const [contentError, setContentError] = useState("");
	const [imageError, setImageError] = useState("");

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();

		formData.append("title", e.target.title.value);
		formData.append("category", e.target.category.value);
		formData.append("content", e.target.content.value);
		formData.append("image", e.target.image.files[0]);

		let config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};

		const res = await axios.post(
			`${process.env.base_url}/api/posts`,
			formData,
			config
		);
		const result = res.data;

		if (result.error) {
			if (result.message.title) {
				setTitleError(result.message.title);
			} else {
				setTitleError("");
			}

			if (result.message.category) {
				setCategoryError(result.message.category);
			} else {
				setCategoryError("");
			}

			if (result.message.content) {
				setContentError(result.message.content);
			} else {
				setContentError("");
			}

			if (result.message.image) {
				setImageError(result.message.image);
			} else {
				setImageError("");
			}
		} else {
			router.push("/posts");
			sessionStorage.setItem("message", result.message);
			sessionStorage.setItem("status", result.type);
		}
	};
	if (!loggedIn) {
		return <Loader />;
	}
	return (
		<>
			<Head>
				<title>Create New Post</title>
			</Head>
			<div className="row my-4">
				<div className="col-lg-8 mx-auto">
					<div className="card shadow">
						<div className="card-header">
							<h2 className="text-secondary fw-bold">Create New Post</h2>
						</div>
						<div className="card-body p-5">
							<form onSubmit={handleFormSubmit}>
								<div className="mb-3">
									<label htmlFor="title">Post Title</label>
									<input
										type="text"
										name="title"
										id="title"
										className={`form-control ${
											titleError != "" ? "is-invalid" : ""
										}`}
									/>
									<div className="invalid-feedback">{titleError}</div>
								</div>

								<div className="mb-3">
									<label htmlFor="category">Post Category</label>
									<input
										type="text"
										name="category"
										id="category"
										className={`form-control ${
											categoryError != "" ? "is-invalid" : ""
										}`}
									/>
									<div className="invalid-feedback">{categoryError}</div>
								</div>

								<div className="mb-3">
									<label htmlFor="image">Post Image</label>
									<input
										type="file"
										name="image"
										id="image"
										className={`form-control ${
											imageError != "" ? "is-invalid" : ""
										}`}
									/>
									<div className="invalid-feedback">{imageError}</div>
								</div>

								<div className="mb-3">
									<label htmlFor="content">Post Content</label>
									<textarea
										name="content"
										id="content"
										rows="4"
										className={`form-control ${
											contentError != "" ? "is-invalid" : ""
										}`}
									></textarea>
									<div className="invalid-feedback">{contentError}</div>
								</div>

								<div className="d-grid">
									<button type="submit" className="btn btn-primary">
										Create Post
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Create;
