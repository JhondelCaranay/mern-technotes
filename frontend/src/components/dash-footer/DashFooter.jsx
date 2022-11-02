import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";

const DashFooter = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const onGoHomeClicked = () => navigate("/dash");

	const goHomeButton =
		pathname !== "/dash" ? (
			<button
				className="dash-footer__button icon-button"
				title="Home"
				onClick={onGoHomeClicked}
			>
				<FontAwesomeIcon icon={faHouse} />
			</button>
		) : null;

	return (
		<footer className="dash-footer">
			{goHomeButton}
			<p>Current User:</p>
			<p>Status:</p>
		</footer>
	);
};

export default DashFooter;
