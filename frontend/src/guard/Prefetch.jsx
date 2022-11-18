import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { store } from "../redux/app/store";
import { notesApiSlice } from "../redux/services/notes/notesApiSlice";
import { usersApiSlice } from "../redux/services/users/usersApiSlice";

const Prefetch = () => {
	// this will fetch all users and notes one time, when component is mounted
	useEffect(() => {
		// console.log("subscribing");
		// const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate());
		// const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

		// return () => {
		// 	console.log("unsubscribing");
		// 	notes.unsubscribe();
		// 	users.unsubscribe();
		// };

		store.dispatch(notesApiSlice.util.prefetch('getNotes', 'notesList', { force: true }))
		store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
	}, []);

	return <Outlet />;
};
export default Prefetch;
