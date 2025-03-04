import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import UrlsTable from "./UrlsTable";
import ShortnerTool from "./ShortnerTool";
import Analytics from "./Analytics";

// Mock data for URLs
const mockUrls = [
	{
		id: "1",
		originalUrl: "https://example.com/very-long-url-that-needs-shortening",
		shortUrl: "shorty.io/a1b2c3",
		clicks: 42,
		createdAt: "2023-01-15T12:00:00Z",
		expiresAt: "2024-01-15T12:00:00Z",
	},
	{
		id: "2",
		originalUrl: "https://another-example.com/blog/article/12345",
		shortUrl: "shorty.io/d4e5f6",
		clicks: 128,
		createdAt: "2023-02-20T14:30:00Z",
		expiresAt: null,
	},
	{
		id: "3",
		originalUrl: "https://docs.google.com/spreadsheets/d/1234567890",
		shortUrl: "shorty.io/g7h8i9",
		clicks: 17,
		createdAt: "2023-03-05T09:15:00Z",
		expiresAt: "2023-12-31T23:59:59Z",
	},
];

function Dashboard() {
	const [urls, setUrls] = useState(mockUrls);

	// Mock user data
	const user = {
		username: "JohnDoe",
		totalUrls: mockUrls.length,
		totalClicks: mockUrls.reduce((sum, url) => sum + url.clicks, 0),
	};

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Header />

			<main className="flex-grow container mx-auto py-8 px-4">
				{/* A. Welcome Message / User Info Panel */}
				<div className="bg-white p-6 rounded-lg shadow-md mb-8">
					<h1 className="text-2xl font-bold text-gray-800">
						Welcome back, {user.username}!
					</h1>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
							<p className="text-sm text-blue-600">Total URLs</p>
							<p className="text-2xl font-bold text-blue-800">
								{user.totalUrls}
							</p>
						</div>
						<div className="bg-green-50 p-4 rounded-lg border border-green-100">
							<p className="text-sm text-green-600">
								Total Clicks
							</p>
							<p className="text-2xl font-bold text-green-800">
								{user.totalClicks}
							</p>
						</div>
						<div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
							<p className="text-sm text-purple-600">
								Active URLs
							</p>
							<p className="text-2xl font-bold text-purple-800">
								{
									urls.filter(
										(u) =>
											!u.expiresAt ||
											new Date(u.expiresAt) > new Date(),
									).length
								}
							</p>
						</div>
					</div>
				</div>

				<ShortnerTool />
				<UrlsTable urls={urls} setUrls={setUrls} />
				<Analytics urls={urls} />
			</main>

			<Footer />
		</div>
	);
}

export default Dashboard;
