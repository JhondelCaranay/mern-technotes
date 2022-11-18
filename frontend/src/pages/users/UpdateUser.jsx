import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EditUserForm from "../../components/edit-user-form/EditUserForm";
import { selectUserById } from "../../redux/services/users/usersApiSlice";

const UpdateUser = () => {
	const { id } = useParams();

	const user = useSelector((state) => selectUserById(state, id));

	const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>;

	return content;
};
export default UpdateUser;
