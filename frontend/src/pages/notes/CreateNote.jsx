// import { useSelector } from "react-redux";
// import { selectAllUsers } from "../../redux/services/users/usersApiSlice";
import PulseLoader from 'react-spinners/PulseLoader'
import CreateNoteForm from '../../components/create-note-form/CreateNoteForm'
import useTitle from '../../hook/useTitle'
import { useGetUsersQuery } from '../../redux/services/users/usersApiSlice'

const CreateNote = () => {
	useTitle('techNotes: New Note')
	// const users = useSelector(selectAllUsers);

	// useTitle('techNotes: New Note')

	const { users } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			users: data?.ids.map(id => data?.entities[id])
		}),
	})

	// 	if (!users?.length) return <p>Not Currently Available</p>

	// 	const content = users ? <CreateNoteForm users={users} /> : <p>Loading...</p>;

	// 	return content;
	// };

	if (!users?.length) return <PulseLoader color={"#FFF"} />

	const content = <CreateNoteForm users={users} />

	return content
}

export default CreateNote;
