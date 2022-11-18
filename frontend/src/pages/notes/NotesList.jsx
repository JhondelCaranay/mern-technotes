import NotesTableRow from "../../components/notes-table-row/NotesTableRow";
import useAuth from "../../hook/useAuth";
import { useGetNotesQuery } from "../../redux/services/notes/notesApiSlice";
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from "../../hook/useTitle";

const NotesList = () => {
	useTitle('techNotes: Notes List')
	const { username, isManager, isAdmin } = useAuth()

	const {
		data: notes,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetNotesQuery('notesList', {
		pollingInterval: 15000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});
	// queryArg - used to refetch data when queryArg changes

	let content;

	if (isLoading) content = <PulseLoader color={"#FFF"} />

	if (isError) {
		content = <p className="errmsg">{error?.data?.message}</p>;
		console.log("🚀 ~ file: NotesList.jsx ~ line 23 ~ NotesList ~ error", error)
	}

	if (isSuccess) {
		const { ids, entities } = notes

		let filteredIds
		if (isManager || isAdmin) {
			filteredIds = [...ids]
		} else {
			filteredIds = ids.filter(noteId => entities[noteId].username === username)
		}

		const tableContent = ids?.length && filteredIds.map(noteId => <NotesTableRow key={noteId} noteId={noteId} />)


		// const tableContent = ids?.length
		// 	? ids.map((noteId) => <NotesTableRow key={noteId} noteId={noteId} />)
		// 	: null;

		content = (
			<table className="table table--notes">
				<thead className="table__thead">
					<tr>
						<th scope="col" className="table__th note__status">
							Username
						</th>
						<th scope="col" className="table__th note__created">
							Created
						</th>
						<th scope="col" className="table__th note__updated">
							Updated
						</th>
						<th scope="col" className="table__th note__title">
							Title
						</th>
						<th scope="col" className="table__th note__username">
							Owner
						</th>
						<th scope="col" className="table__th note__edit">
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
export default NotesList;
