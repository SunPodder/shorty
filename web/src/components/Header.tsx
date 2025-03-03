import { Link } from "react-router";
import {
	User,
	LogIn,
	Settings,
	LogOut,
	LayoutDashboard,
	Link as LinkIcon,
} from "lucide-react";
import { pb } from "../hooks/usePB";

function Header() {

	return (
		<header className="p-4 bg-gray-100 border-b border-gray-300">
			<div className="flex justify-between items-center mx-8">
			<div className="text-2xl font-bold">Shorty</div>
			<div className="flex items-center space-x-4">
				{pb.authStore.isValid ? (
					<>
						<Link
							to="/dashboard"
							className="text-blue-500 flex items-center"
						>
							<LayoutDashboard className="mr-1" /> Dashboard
						</Link>
						<Link
							to="/my-urls"
							className="text-blue-500 flex items-center"
						>
							<LinkIcon className="mr-1" /> My URLs
						</Link>
						<div className="relative group">
							<button className="text-blue-500 flex items-center">
								<User className="mr-1" /> Profile
							</button>
							<div className="absolute right-0 w-48 bg-white border border-gray-300 rounded shadow-lg hidden group-hover:block">
								<Link
									to="/settings"
									className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
								>
									<Settings className="mr-1" /> Settings
								</Link>
								<Link
									to="/logout"
									className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
								>
									<LogOut className="mr-1" /> Logout
								</Link>
							</div>
						</div>
					</>
				) : (
					<Link
						to="/signin"
						className="text-blue-500 flex items-center"
					>
						<LogIn className="mr-1" /> Sign In
					</Link>
				)}
			</div>
			</div>
		</header>
	);
}

export default Header;
