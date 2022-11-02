import { Outlet } from "react-router-dom";
import DashFooter from "../dash-footer/DashFooter";
import DashHeader from "../dash-header/DashHeader";

const DashLayout = () => {
	return (
		<>
			<DashHeader />
			<div className="dash-container">
				<Outlet />
			</div>
			<DashFooter />
		</>
	);
};
export default DashLayout;
