import UserTableRow from "../../../components/user-table-row/UserTableRow";
import {
	selectAllUsers,
	useGetUsersQuery,
} from "../../../redux/services/users/usersApiSlice";
import { useSelector } from "react-redux";
const UsersList = () => {
	// const testuser = useSelector((state) => selectAllUsers(state));
	// console.log("testuser", testuser);
	const {
		data: users,
		error,
		isLoading,
		isSuccess,
		isError,
	} = useGetUsersQuery(undefined, {
		pollingInterval: 60000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	let content;

	if (isLoading) {
		content = <p>Loading...</p>;
	}

	if (isError) {
		content = <p className="errmsg">{error?.data?.message}</p>;
	}

	if (isSuccess) {
		// console.log("users", users);
		const { ids } = users;

		const tableContent =
			ids?.length &&
			ids.map((userId) => <UserTableRow key={userId} userId={userId} />);

		content = (
			<table className="table table--users">
				<thead className="table__thead">
					<tr>
						<th scope="col" className="table__th user__username">
							Username
						</th>
						<th scope="col" className="table__th user__roles">
							Roles
						</th>
						<th scope="col" className="table__th user__edit">
							Edit
						</th>
					</tr>
				</thead>
				<tbody>{tableContent}</tbody>
			</table>
		);
	}

	return content;
};

export default UsersList;
