import { Route, Routes } from "react-router-dom";
import DashLayout from "./components/dash-layout/DashLayout";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/login/Login";
import NotesList from "./pages/notes/notes-list/NotesList";
import Public from "./pages/public/Public";
import UsersList from "./pages/users/users-list/UsersList";
import Welcome from "./pages/auth/welcome/Welcome";
import CreateUser from "./pages/users/create-user/CreateUser";
import CreateNote from "./pages/notes/create-note/CreateNote";
import UpdateNote from "./pages/notes/update-note/UpdateNote";
import UpdateUser from "./pages/users/update-user/UpdateUser";
import Prefetch from "./redux/services/auth/Prefetch";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Public />} />
				<Route path="login" element={<Login />} />
			</Route>
			<Route element={<Prefetch />}>
				<Route path="/dash" element={<DashLayout />}>
					<Route index element={<Welcome />} />

					<Route path="users">
						<Route index element={<UsersList />} />
						<Route path="create" element={<CreateUser />} />
						<Route path=":id" element={<UpdateUser />} />
					</Route>

					<Route path="notes">
						<Route index element={<NotesList />} />
						<Route path="create" element={<CreateNote />} />
						<Route path=":id" element={<UpdateNote />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
