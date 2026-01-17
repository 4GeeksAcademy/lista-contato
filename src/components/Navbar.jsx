import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light  px-3">
			<div className="ms-auto d-flex gap-3">

				<Link className="btn btn-pink link-pink" to="/"> Go to Contact List</Link>
			</div>
		</nav>
	);
};