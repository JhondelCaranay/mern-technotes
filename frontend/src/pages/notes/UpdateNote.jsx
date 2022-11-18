// import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import UpdateNoteForm from "../../components/update-note-form/UpdateNoteForm";
// import { selectNoteById } from "../../redux/services/notes/notesApiSlice";
// import { selectAllUsers } from "../../redux/services/users/usersApiSlice";
import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from "../../hook/useAuth";
import { useGetNotesQuery } from "../../redux/services/notes/notesApiSlice";
import { useGetUsersQuery } from "../../redux/services/users/usersApiSlice";
import useTitle from "../../hook/useTitle";
const UpdateNote = () => {
	useTitle('techNotes: Edit Note')
	const { id } = useParams();

	// const note = useSelector((state) => selectNoteById(state, id));
	// const users = useSelector(selectAllUsers);

	const { username, isManager, isAdmin } = useAuth()

	const { note } = useGetNotesQuery("notesList", {
		selectFromResult: ({ data }) => ({
			note: data?.entities[id]
		}),
	})

	const { users } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			users: data?.ids.map(id => data?.entities[id])
		}),
	})

	if (!note || !users?.length) return <PulseLoader color={"#FFF"} />


	if (!isManager && !isAdmin) {
		if (note.username !== username) {
			return <p className="errmsg">No access</p>
		}
	}

	const content = <UpdateNoteForm note={note} users={users} />;

	return content;
};
export default UpdateNote;
