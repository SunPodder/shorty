import { Check, Clipboard, Globe } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export default function ShortnerTool({
	setUrls,
}: {
	setUrls: (cb: (prev: URLData[]) => URLData[]) => void;
}) {
	const [url, setUrl] = useState("");
	const [customAlias, setCustomAlias] = useState("");
	const [newShortUrl, setNewShortUrl] = useState("");
	const [expiryDate, setExpiryDate] = useState(""); // Store as YYYY-MM-DD string from input type="date"
	const [isOneTimeView, setIsOneTimeView] = useState(false);
	const [showCopied, setShowCopied] = useState(false);
	const [error, setError] = useState(""); // For displaying errors

	const { authToken } = useAuth(); // Get authToken

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			setShowCopied(true);
			setTimeout(() => setShowCopied(false), 2000);
		});
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(""); // Clear previous errors

		const requestBody: {
			original_url: string;
			custom_code?: string;
			expiry_date?: number; // Unix timestamp in seconds
			view_once?: boolean;
			token?: string;
		} = {
			original_url: url,
		};

		if (customAlias) {
			requestBody.custom_code = customAlias;
		}
		if (expiryDate) {
			// Convert YYYY-MM-DD to Unix timestamp (seconds)
			requestBody.expiry_date = Math.floor(
				new Date(expiryDate).getTime() / 1000
			);
		}
		if (isOneTimeView) {
			requestBody.view_once = isOneTimeView;
		}
		if (authToken) {
			requestBody.token = authToken; // Include token if user is authenticated
		}

		try {
			const response = await fetch(`${API_ENDPOINT}new`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ message: "Failed to shorten URL" }));
				throw new Error(errorData.message || errorData.error || "Failed to shorten URL");
			}

			const data: URLData = await response.json();
      // Construct the display URL based on VITE_API_ENDPOINT and the returned ShortCode
      // Ensuring the base URL for the short link is correct, not necessarily the API endpoint itself for shortening.
      // This might need adjustment based on how resolved URLs are structured.
      // For now, let's assume the API_ENDPOINT base is also where short URLs are resolved.
      const baseShortUrl = API_ENDPOINT.replace(/\/new\/?$/, "/"); // Attempt to get base path
			const displayShortUrl = `${baseShortUrl}${data.shortCode}`;

			setUrls((prev: URLData[]) => [...prev, { ...data, displayShortURL: displayShortUrl }]);
			setNewShortUrl(displayShortUrl);

			// Reset form
			setUrl("");
			setCustomAlias("");
			setExpiryDate("");
			setIsOneTimeView(false);
		} catch (err) {
			console.error(err);
			setError(
				err instanceof Error ? err.message : "An unknown error occurred."
			);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md mb-8">
			<h2 className="text-xl font-semibold text-gray-800 mb-4">
				Shorten a New URL
			</h2>
			{error && (
				<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
					<p>{error}</p>
				</div>
			)}
			<form
				onSubmit={handleSubmit}
				className="space-y-4 md:space-y-4 md:grid md:grid-cols-12 md:gap-4"
			>
				{/* First row */}
				<div className="md:col-span-6">
					<label
						htmlFor="url"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						URL to shorten
					</label>
					<div className="flex rounded-md shadow-sm">
						<div className="relative flex items-stretch flex-grow focus-within:z-10">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Globe className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="url"
								name="url"
								id="url"
								className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300 py-2 border"
								placeholder="https://example.com/long-url"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								required
							/>
						</div>
					</div>
				</div>

				<div className="md:col-span-6">
					<label
						htmlFor="custom-alias"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Custom alias (optional)
					</label>
					<div className="flex rounded-md shadow-sm">
						<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
							{API_ENDPOINT.replace(/\/(new|dev)\/$/, "/")} {/* Display base URL */}
						</span>
						<input
							type="text"
							name="custom-alias"
							id="custom-alias"
							className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 py-2 pl-2 border"
							placeholder="custom-name"
							value={customAlias}
							onChange={(e) => setCustomAlias(e.target.value)}
						/>
					</div>
				</div>

				{/* Second row */}
				<div className="md:col-span-6">
					<label
						htmlFor="expiry-date"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Expiry date (optional)
					</label>
					<div className="flex rounded-md shadow-sm">
						<input
							type="date"
							name="expiry-date"
							id="expiry-date"
							className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm border-gray-300 py-2 border placeholder-shown:text-gray-500 px-2"
							value={expiryDate}
							onChange={(e) => setExpiryDate(e.target.value)}
							min={new Date().toISOString().split("T")[0]}
						/>
					</div>
				</div>

				<div className="md:col-span-4 lg:col-span-3 2xl:col-span-2">
					<div className="flex flex-col">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							One-time view (optional)
						</label>
						<div className="flex items-center h-full py-2">
							<input
								type="checkbox"
								id="one-time-view"
								name="one-time-view"
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								checked={isOneTimeView}
								onChange={(e) =>
									setIsOneTimeView(e.target.checked)
								}
							/>
							<label
								htmlFor="one-time-view"
								className="ml-2 block text-sm text-gray-900"
							>
								Self-destruct after first view
							</label>
						</div>
					</div>
				</div>

				{/* Button row */}
				<div className=" mt-4 md:col-span-12 md:flex md:items-end">
					<button
						type="submit"
						className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 md:w-auto"
					>
						Shorten
					</button>
				</div>
			</form>

			{newShortUrl && (
				<div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
					<div className="flex justify-between items-center">
						<span className="font-medium">Your new short URL:</span>
						<button
							onClick={() => copyToClipboard(newShortUrl)}
							className="text-blue-600 hover:text-blue-800 flex items-center"
						>
							{showCopied ? (
								<Check size={16} className="mr-1" />
							) : (
								<Clipboard size={16} className="mr-1" />
							)}
							{showCopied ? "Copied!" : "Copy"}
						</button>
					</div>
					{/* Make the link clickable and open in a new tab */}
					<a
						href={newShortUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:underline block break-all"
					>
						{newShortUrl}
					</a>
				</div>
			)}
		</div>
	);
}
