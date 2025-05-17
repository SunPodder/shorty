import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import UrlsTable from "./UrlsTable";
import ShortnerTool from "./ShortnerTool";
import Analytics from "./Analytics";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;



function Dashboard() {
	const [urls, setUrls] = useState<URLData[]>([]);
	const { isAuthenticated, authToken } = useAuth(); // Removed user, as it's not used directly for now
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isAuthenticated && authToken) {
			setIsLoading(true);
			setError(null);
			fetch(`${API_ENDPOINT}me`, {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			})
				.then((response) => {
					if (!response.ok) {
                        // Try to parse error message from backend
                        return response.json().then(errData => {
                            throw new Error(errData.error || errData.message || "Failed to fetch URLs");
                        }).catch(() => {
                            throw new Error("Failed to fetch URLs, and couldn't parse error response.");
                        });
					}
					return response.json();
				})
				.then((data: URLData[] | null) => { // Data can be null if no URLs
					if (data && Array.isArray(data)) {
                        const baseShortUrl = API_ENDPOINT.replace(/(me|new|dev)\/$/, ""); // Regex corrected
                        const processedUrls = data.map(url => ({
                            ...url,
                            displayShort_url: `${baseShortUrl}${url.short_code}`
                        }));
                        setUrls(processedUrls);
                    } else {
                        setUrls([]); // Set to empty array if data is null or not an array
                    }
				})
				.catch((err) => {
					console.error("Error fetching URLs:", err);
					setError(err.message || "Could not load URLs.");
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else if (!isAuthenticated) {
			setIsLoading(false); 
		}
	}, [isAuthenticated, authToken]);

	if (!isAuthenticated && !isLoading) { 
		return <Navigate replace to="/signin" />;
	}

	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col bg-gray-50 items-center justify-center">
				<Header /> {/* Added Header for consistency during loading */}
				<main className="flex-grow container mx-auto py-8 px-4 text-center">
					<p>Loading dashboard...</p>
				</main>
				<Footer /> {/* Added Footer for consistency during loading */}
			</div>
		);
	}
	
	if (error) {
		return (
			<div className="min-h-screen flex flex-col bg-gray-50">
				<Header />
				<main className="flex-grow container mx-auto py-8 px-4">
					<div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
						<h1 className="text-2xl font-bold text-red-600">Error</h1>
						<p className="text-gray-700 mt-2">{error}</p>
						<button 
							onClick={() => {
								setError(null);
								setIsLoading(true);
								const event = new Event('effecttrigger'); document.dispatchEvent(event);
							}}
							className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							Try again
						</button>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Header />

			<main className="flex-grow container mx-auto py-8 px-4">
				<div className="bg-white p-6 rounded-lg shadow-md mb-8">
					<h1 className="text-2xl font-bold text-gray-800">
						Welcome back!
					</h1>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
							<p className="text-sm text-blue-600">Total URLs</p>
							<p className="text-2xl font-bold text-blue-800">
								{urls.length}
							</p>
						</div>
						<div className="bg-green-50 p-4 rounded-lg border border-green-100">
							<p className="text-sm text-green-600">
								Total Clicks
							</p>
							<p className="text-2xl font-bold text-green-800">
								{urls.reduce((acc, u) => acc + u.clicks, 0)}
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
											!u.expiry_date || 
											(u.expiry_date * 1000) > new Date().getTime(),
									).length
								}
							</p>
						</div>
					</div>
				</div>

				<ShortnerTool setUrls={setUrls} />
				<UrlsTable urls={urls} setUrls={setUrls} />
				<Analytics urls={urls} />
			</main>

			<Footer />
		</div>
	);
}

export default Dashboard;
