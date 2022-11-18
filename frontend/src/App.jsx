import { Route, Routes } from "react-router-dom";
import DashLayout from "./components/dash-layout/DashLayout";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import NotesList from "./pages/notes/NotesList";
import Public from "./pages/public/Public";
import UsersList from "./pages/users/UsersList";
import Welcome from "./pages/auth/Welcome";
import CreateUser from "./pages/users/CreateUser";
import CreateNote from "./pages/notes/CreateNote";
import UpdateNote from "./pages/notes/UpdateNote";
import UpdateUser from "./pages/users/UpdateUser";
import Prefetch from "./guard/Prefetch";
import PersistLogin from "./guard/PersistLogin";
import { ROLES } from "./config/roles";
import RequireAuth from "./guard/RequireAuth";
import useTitle from "./hook/useTitle";

function App() {
	useTitle('Del Repair Shop');
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Public />} />
				<Route path="login" element={<Login />} />
			</Route>

			<Route element={<PersistLogin />}>
				<Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
					<Route element={<Prefetch />}>
						<Route path="/dash" element={<DashLayout />}>
							<Route index element={<Welcome />} />

							<Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
								<Route path="users">
									<Route index element={<UsersList />} />
									<Route path="create" element={<CreateUser />} />
									<Route path=":id" element={<UpdateUser />} />
								</Route>
							</Route>

							<Route path="notes">
								<Route index element={<NotesList />} />
								<Route path="create" element={<CreateNote />} />
								<Route path=":id" element={<UpdateNote />} />
							</Route>
						</Route>
					</Route>
				</Route>
			</Route>

			{/* 404 page */}
			<Route path="*" element={<div>404</div>} />
		</Routes>
	);
}

export default App;
