import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Signin from "./pages/Sigin";
import Dashboard from "./pages/Dashboard";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/signin" element={<Signin />} />
			<Route path="/dashboard" element={<Dashboard />} />
		</Routes>
	);
}
