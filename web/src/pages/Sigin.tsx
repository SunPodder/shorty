import { useState, FormEvent, useEffect } from "react";
import { Link, Navigate } from "react-router";
import {
	Mail,
	Lock,
	Github,
	ArrowLeft,
	EyeOff,
	Eye,
	XCircle,
	CheckCircle,
} from "lucide-react";
import { pb, useAuth } from "../hooks/useAuth";

function Signin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
	const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(
		null,
	);

	const { isAuthenticated } = useAuth();

	// Validate email on change
	useEffect(() => {
		if (email === "") {
			setIsEmailValid(null);
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		setIsEmailValid(emailRegex.test(email));
	}, [email]);

	// Validate password on change (minimum 8 characters)
	useEffect(() => {
		if (password === "") {
			setIsPasswordValid(null);
			return;
		}

		setIsPasswordValid(password.length >= 8);
	}, [password]);

	// Redirect to /dashboard if user is already signed in
	if (isAuthenticated) {
		return <Navigate replace to="/dashboard" />;
	}

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			// Call login API or auth function here
			console.log("Logging in with:", email, password);

			const data = await pb
				.collection("users")
				.authWithPassword(email, password);

			console.log(data);
			if (isAuthenticated) {
				return <Navigate replace to="/dashboard" />;
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_err) {
			setError("Invalid email or password");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRegister = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			// Call register API or auth function here
			const data = {
				password: password,
				passwordConfirm: password,
				email: email,
			};
			const record = await pb.collection("users").create(data);

			if (record?.id) {
				await pb.collection("users").authWithPassword(email, password);
			}

			if (isAuthenticated) {
				return <Navigate replace to="/dashboard" />;
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_err) {
			setError("Registration failed. Email might already be in use.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGitHubLogin = async () => {
		setError("");
		setIsLoading(true);

		try {
			// GitHub OAuth login logic here
			console.log("GitHub login");

			await pb.collection("users").authWithOAuth2({ provider: "github" });

			if (isAuthenticated) {
				return <Navigate replace to="/dashboard" />;
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_err) {
			setError("GitHub login failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
				<div className="bg-blue-600 p-6 text-center">
					<h1 className="text-2xl font-bold text-white">
						Welcome to Shorty
					</h1>
					<p className="text-blue-100 mt-2">
						Sign in or create a new account
					</p>
				</div>

				<div className="p-8">
					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
							{error}
						</div>
					)}

					<form>
						<div className="mb-6">
							<label
								htmlFor="email"
								className="block text-gray-700 text-sm font-semibold mb-2"
							>
								Email Address
							</label>
							<div
								className={`flex items-center border-2 rounded-lg transition-colors ${
									isEmailValid === true
										? "border-green-500"
										: isEmailValid === false
											? "border-red-500"
											: "border-gray-200 focus-within:border-blue-500"
								}`}
							>
								<Mail
									size={18}
									className={`ml-3 ${
										isEmailValid === true
											? "text-green-500"
											: isEmailValid === false
												? "text-red-500"
												: "text-gray-400"
									}`}
								/>
								<input
									id="email"
									type="email"
									className="w-full py-2 px-3 outline-none text-gray-700"
									placeholder="your@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									disabled={isLoading}
								/>
								{isEmailValid !== null &&
									(isEmailValid ? (
										<CheckCircle
											size={18}
											className="mr-3 text-green-500"
										/>
									) : (
										<XCircle
											size={18}
											className="mr-3 text-red-500"
										/>
									))}
							</div>
							{isEmailValid === false && (
								<p className="mt-1 text-red-500 text-xs">
									Please enter a valid email address
								</p>
							)}
						</div>

						<div className="mb-6">
							<label
								htmlFor="password"
								className="block text-gray-700 text-sm font-semibold mb-2"
							>
								Password
							</label>
							<div
								className={`flex items-center border-2 rounded-lg transition-colors ${
									isPasswordValid === true
										? "border-green-500"
										: isPasswordValid === false
											? "border-red-500"
											: "border-gray-200 focus-within:border-blue-500"
								}`}
							>
								<Lock
									size={18}
									className={`ml-3 ${
										isPasswordValid === true
											? "text-green-500"
											: isPasswordValid === false
												? "text-red-500"
												: "text-gray-400"
									}`}
								/>
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									className="w-full py-2 px-3 outline-none text-gray-700"
									placeholder="••••••••"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
									disabled={isLoading}
								/>
								<button
									type="button"
									className="px-3 text-gray-400 hover:text-gray-600 focus:outline-none"
									onClick={() =>
										setShowPassword(!showPassword)
									}
								>
									{showPassword ? (
										<EyeOff size={18} />
									) : (
										<Eye size={18} />
									)}
								</button>
								{isPasswordValid !== null &&
									(isPasswordValid ? (
										<CheckCircle
											size={18}
											className="mr-3 text-green-500"
										/>
									) : (
										<XCircle
											size={18}
											className="mr-3 text-red-500"
										/>
									))}
							</div>
							{isPasswordValid === false && (
								<p className="mt-1 text-red-500 text-xs">
									Password must be at least 8 characters
								</p>
							)}
						</div>

						<div className="flex flex-col md:flex-row gap-4 mb-6">
							<button
								type="submit"
								className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex-1 transition-colors"
								onClick={handleLogin}
								disabled={isLoading}
							>
								{isLoading ? "Processing..." : "Log In"}
							</button>
							<button
								type="submit"
								className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg flex-1 transition-colors"
								onClick={handleRegister}
								disabled={isLoading}
							>
								{isLoading ? "Processing..." : "Register"}
							</button>
						</div>

						<div className="relative flex items-center justify-center my-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center">
								<span className="bg-white px-4 text-gray-500 text-sm">
									OR
								</span>
							</div>
						</div>

						<button
							type="button"
							className="w-full flex items-center justify-center border-2 border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
							onClick={handleGitHubLogin}
							disabled={isLoading}
						>
							<Github size={20} className="mr-2" />
							Sign in with GitHub
						</button>
					</form>

					<div className="text-center mt-8">
						<Link
							to="/"
							className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
						>
							<ArrowLeft size={16} className="mr-1" /> Back to
							Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Signin;
