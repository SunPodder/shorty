import { Link } from "react-router";
import {
	User,
	LogIn,
	Settings,
	LogOut,
	LayoutDashboard,
	Link as LinkIcon,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

function Header() {
	const { isAuthenticated } = useAuth();

	return (
		<header className="p-4 bg-gray-100 border-b border-gray-300">
			<div className="flex justify-between items-center mx-8">
				<div className="text-2xl font-bold">
					<Link to="/">Shorty</Link>
				</div>
				<div className="flex items-center space-x-4">
					{isAuthenticated ? (
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
									<button
										className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center w-full"
										onClick={() => null} // Add logout functionality here
									>
										<LogOut className="mr-1" /> Logout
									</button>
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
