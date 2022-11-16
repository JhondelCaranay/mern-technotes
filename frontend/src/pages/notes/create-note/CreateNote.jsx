import { useSelector } from "react-redux";
import CreateNoteForm from "../../../components/create-note-form/CreateNoteForm";
import { selectAllUsers } from "../../../redux/services/users/usersApiSlice";

const CreateNote = () => {
	const users = useSelector(selectAllUsers);

	if (!users?.length) return <p>Not Currently Available</p>

	const content = users ? <CreateNoteForm users={users} /> : <p>Loading...</p>;

	return content;
};
export default CreateNote;
