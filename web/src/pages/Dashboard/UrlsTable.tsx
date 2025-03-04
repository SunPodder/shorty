import { AlertCircle, BarChart2, Clipboard, Edit, ExternalLink, Trash2 } from "lucide-react";

function UrlsTable({
	urls,
	setUrls,
}: {
	urls: Url[];
	setUrls: (urls: Url[]) => void;
}) {
	const deleteUrl = (id: string) => {
		setUrls(urls.filter((url) => url.id !== id));
	};

	// Function to truncate long URLs for display
	const truncateUrl = (url: string, maxLength = 40) => {
		return url.length > maxLength
			? `${url.substring(0, maxLength)}...`
			: url;
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).catch((err) => {
			console.error("Failed to copy to clipboard:", err);
		});
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md mb-8">
			<h2 className="text-xl font-semibold text-gray-800 mb-4">
				My Shortened URLs
			</h2>
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Original URL
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Short URL
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Clicks
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Created
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Expires
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{urls.map((url) => (
							<tr key={url.id}>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
									<div className="flex items-center">
										<span
											className="truncate max-w-xs"
											title={url.originalUrl}
										>
											{truncateUrl(url.originalUrl)}
										</span>
										<a
											href={url.originalUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="ml-2 text-gray-400 hover:text-gray-600"
										>
											<ExternalLink size={14} />
										</a>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
									<div className="flex items-center">
										<span>{url.shortUrl}</span>
										<button
											onClick={() =>
												copyToClipboard(url.shortUrl)
											}
											className="ml-2 text-gray-400 hover:text-gray-600"
										>
											<Clipboard size={14} />
										</button>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
									{url.clicks}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
									{new Date(
										url.createdAt,
									).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
									{url.expiresAt
										? new Date(
												url.expiresAt,
											).toLocaleDateString()
										: "Never"}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
									<div className="flex items-center space-x-3">
										<button className="text-blue-600 hover:text-blue-800">
											<Edit size={16} />
										</button>
										<button
											className="text-red-600 hover:text-red-800"
											onClick={() => deleteUrl(url.id)}
										>
											<Trash2 size={16} />
										</button>
										<button className="text-purple-600 hover:text-purple-800">
											<BarChart2 size={16} />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{urls.length === 0 && (
				<div className="text-center py-8 text-gray-500">
					<AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
					<h3 className="mt-2 text-sm font-medium text-gray-900">
						No URLs found
					</h3>
					<p className="mt-1 text-sm text-gray-500">
						Get started by shortening a new URL above.
					</p>
				</div>
			)}
		</div>
	);
}

export default UrlsTable;
