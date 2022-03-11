const Loader = () => {
	return (
		<>
			<div className="row min-vh-100 justify-content-center align-items-center">
				<div className="text-center">
					<div
						className="spinner-border text-success"
						style={{ width: "5rem", height: "5rem" }}
						role="status"
					>
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default Loader;
