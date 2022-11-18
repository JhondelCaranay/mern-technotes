// import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EditUserForm from "../../components/edit-user-form/EditUserForm";
// import { selectUserById } from "../../redux/services/users/usersApiSlice";
import PulseLoader from 'react-spinners/PulseLoader'
import { useGetUsersQuery } from "../../redux/services/users/usersApiSlice";
import useTitle from "../../hook/useTitle";
const UpdateUser = () => {
	useTitle('techNotes: Edit User')
	const { id } = useParams();

	// const user = useSelector((state) => selectUserById(state, id));

	const { user } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[id]
		}),
	})


	// const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>;

	if (!user) return <PulseLoader color={"#FFF"} />;

	const content = <EditUserForm user={user} />

	return content;
};
export default UpdateUser;
