import UserTableRow from "../../components/user-table-row/UserTableRow";
import {
	// selectAllUsers,
	// selectTotalUsers,
	// selectUserEntities,
	// selectUserIds,
	useGetUsersQuery,
} from "../../redux/services/users/usersApiSlice";
// import { useSelector } from "react-redux";
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from "../../hook/useTitle";
const UsersList = () => {
	useTitle('techNotes: Users List')
	// const testselectAllUsers = useSelector((state) => selectAllUsers(state));
	// console.log({ testselectAllUsers }); // selectAllUsers - Returns an array of all the entities in the state, sorted by their IDs.
	// const testselectEntities = useSelector((state) => selectUserEntities(state));
	// console.log({ testselectEntities }); // selectUserEntities - Returns an object containing all the entities in the state, indexed by their IDs.
	// const testselectIds = useSelector((state) => selectUserIds(state));
	// console.log({ testselectIds }); // selectUserIds - Returns an array of all the IDs in the state, sorted numerically.
	// const testselectTotal = useSelector((state) => selectTotalUsers(state));
	// console.log({ testselectTotal }); // selectTotalUsers - Returns the total number of entities in the state.
	const {
		data: users,
		error,
		isLoading,
		isSuccess,
		isError,
	} = useGetUsersQuery('usersList', {
		pollingInterval: 60000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});


	let content;

	if (isLoading) content = <PulseLoader color={"#FFF"} />

	if (isError) {
		content = <p className="errmsg">{error?.data?.message}</p>;
	}

	if (isSuccess) {
		const { ids } = users;

		// const tableContent = ids?.length
		// 	? ids.map((userId) => <UserTableRow key={userId} userId={userId} />)
		// 	: null;

		const tableContent = ids?.length && ids.map(userId => <UserTableRow key={userId} userId={userId} />)


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
