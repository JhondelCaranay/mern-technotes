import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUserById } from "../../redux/services/users/usersApiSlice";

const UserTableRow = ({ userId }) => {
	const user = useSelector((state) => selectUserById(state, userId));

	const navigate = useNavigate();

	if (user) {
		const handleEdit = () => navigate(`/dash/users/${userId}`);

		// convert to string and split on comma
		const userRolesString = user.roles.toString().replaceAll(",", ", ");

		const cellStatus = user.active ? "" : "table__cell--inactive";

		return (
			<tr className="table__row user">
				<td className={`table__cell ${cellStatus}`}>{user.username}</td>
				<td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
				<td className={`table__cell ${cellStatus}`}>
					<button className="icon-button table__button">
						<FontAwesomeIcon
							icon={faPenToSquare}
							className="icon_color"
							onClick={handleEdit}
						/>
					</button>
				</td>
			</tr>
		);
	} else return null;
};
export default UserTableRow;
