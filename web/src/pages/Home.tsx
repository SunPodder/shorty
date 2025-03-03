import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { Globe, BarChart2, Users, Clock } from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import Footer from "../components/Footer";

function Modal({
	shortUrl,
	setShowModal,
}: {
	shortUrl: string;
	setShowModal: (show: boolean) => void;
}) {
	return (
		<div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg p-6 max-w-md w-full">
				<h2 className="text-2xl font-bold mb-4">Your shortened URL</h2>
				<div className="bg-gray-100 p-3 rounded mb-4 flex justify-between items-center">
					<span className="font-medium text-blue-600">
						{shortUrl}
					</span>
					<button className="text-gray-600 hover:text-blue-600">
						Copy
					</button>
				</div>
				<div className="flex justify-end gap-4">
					<button
						className="px-4 py-2 text-gray-600 hover:text-gray-800"
						onClick={() => setShowModal(false)}
					>
						Close
					</button>
					<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
						Share
					</button>
				</div>
			</div>
		</div>
	);
}

function Home() {
	const [url, setUrl] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [shortUrl, setShortUrl] = useState("");
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// This is a stub implementation
		const generatedShortUrl = "https://short.ly/abc123";
		setShortUrl(generatedShortUrl);

		if (isAuthenticated) {
			// Redirect to customization page
			navigate("/customize", {
				state: { originalUrl: url, shortUrl: generatedShortUrl },
			});
		} else {
			// Show modal with the short URL
			setShowModal(true);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<div className="fixed top-0 left-0 right-0 z-50">
				<Header />
			</div>

			{/* Hero Section with Background */}
			<div
				className="flex flex-col items-center justify-center p-8 text-white min-h-screen"
				style={{
					backgroundImage:
						"linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop')",
					backdropFilter: "blur(50px)",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
					Make Your Links Shorter
				</h1>
				<p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">
					Simplify your links, track clicks, and manage your shortened
					URLs in one place
				</p>

				{/* URL Shortener Component */}
				<div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
					<form
						onSubmit={handleSubmit}
						className="flex flex-col md:flex-row gap-4"
					>
						<div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 flex-grow">
							<Globe className="text-gray-400 mr-2" size={20} />
							<input
								type="url"
								placeholder="Paste your long URL here..."
								className="bg-transparent w-full outline-none text-gray-800"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								required
							/>
						</div>
						<button
							type="submit"
							className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
						>
							Shorten
						</button>
					</form>
				</div>
			</div>

			{/* Stats Section */}
			<div className="bg-gray-100 py-16">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-12">
						Trusted by millions worldwide
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<div className="bg-white p-6 rounded-lg shadow text-center">
							<div className="text-4xl font-bold text-blue-600 mb-2">
								10M+
							</div>
							<div className="text-gray-600">
								Links shortened monthly
							</div>
						</div>
						<div className="bg-white p-6 rounded-lg shadow text-center">
							<div className="text-4xl font-bold text-blue-600 mb-2">
								5B+
							</div>
							<div className="text-gray-600">Clicks tracked</div>
						</div>
						<div className="bg-white p-6 rounded-lg shadow text-center">
							<div className="text-4xl font-bold text-blue-600 mb-2">
								200K+
							</div>
							<div className="text-gray-600">Active users</div>
						</div>
					</div>
				</div>
			</div>

			{/* Features section */}
			<div className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-12">
						Why choose Shorty?
					</h2>
					<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<div className="p-6 rounded-lg text-center">
							<div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
								<Clock className="text-blue-600" size={28} />
							</div>
							<h3 className="text-xl font-bold mb-2">
								Fast & Easy
							</h3>
							<p className="text-gray-600">
								Create short links with just one click, no
								registration required
							</p>
						</div>
						<div className="p-6 rounded-lg text-center">
							<div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
								<BarChart2
									className="text-blue-600"
									size={28}
								/>
							</div>
							<h3 className="text-xl font-bold mb-2">
								Detailed Analytics
							</h3>
							<p className="text-gray-600">
								Track your link performance with comprehensive
								click statistics
							</p>
						</div>
						<div className="p-6 rounded-lg text-center">
							<div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
								<Users className="text-blue-600" size={28} />
							</div>
							<h3 className="text-xl font-bold mb-2">
								Customization
							</h3>
							<p className="text-gray-600">
								Create branded links with custom slugs and
								domains
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Testimonials section */}
			<div className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-12">
						What our users say
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
						<div className="bg-white p-6 rounded-lg shadow">
							<div className="flex items-center mb-4">
								<div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
									<span className="text-blue-600 font-bold">
										JD
									</span>
								</div>
								<div>
									<div className="font-bold">Jane Doe</div>
									<div className="text-sm text-gray-600">
										Marketing Manager
									</div>
								</div>
							</div>
							<p className="text-gray-700">
								"Shorty has transformed how we share links in
								our campaigns. The analytics features are
								incredibly valuable for tracking performance."
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow">
							<div className="flex items-center mb-4">
								<div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
									<span className="text-blue-600 font-bold">
										JS
									</span>
								</div>
								<div>
									<div className="font-bold">John Smith</div>
									<div className="text-sm text-gray-600">
										Content Creator
									</div>
								</div>
							</div>
							<p className="text-gray-700">
								"I use Shorty for all my social media posts.
								It's simple to use and helps me understand which
								content performs best with my audience."
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow">
							<div className="flex items-center mb-4">
								<div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
									<span className="text-blue-600 font-bold">
										AR
									</span>
								</div>
								<div>
									<div className="font-bold">
										Alex Rodriguez
									</div>
									<div className="text-sm text-gray-600">
										E-commerce Owner
									</div>
								</div>
							</div>
							<p className="text-gray-700">
								"The custom URL feature has been a game-changer
								for our brand recognition. Our customers trust
								our links more now."
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="bg-blue-600 text-white py-16">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl font-bold mb-6">
						Ready to shorten your URLs?
					</h2>
					<p className="text-xl mb-8 max-w-2xl mx-auto">
						Join thousands of marketers, content creators, and
						businesses who trust Shorty for their link management
						needs.
					</p>
					<button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">
						Get Started - It's Free!
					</button>
				</div>
			</div>

			<Footer />

			{showModal && (
				<Modal shortUrl={shortUrl} setShowModal={setShowModal} />
			)}
		</div>
	);
}

export default Home;
