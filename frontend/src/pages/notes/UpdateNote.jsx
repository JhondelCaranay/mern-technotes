import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import UpdateNoteForm from "../../components/update-note-form/UpdateNoteForm";
import { selectNoteById } from "../../redux/services/notes/notesApiSlice";
import { selectAllUsers } from "../../redux/services/users/usersApiSlice";

const UpdateNote = () => {
	const { id } = useParams();

	const note = useSelector((state) => selectNoteById(state, id));
	const users = useSelector(selectAllUsers);

	const content =
		note && users ? <UpdateNoteForm note={note} users={users} /> : <p>Loading...</p>;

	return content;
};
export default UpdateNote;
