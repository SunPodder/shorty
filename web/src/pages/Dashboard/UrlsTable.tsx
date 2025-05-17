import {
	AlertCircle,
	BarChart2,
	Clipboard,
	Edit,
	ExternalLink,
	Trash2,
} from "lucide-react";
import React from "react";

function UrlsTable({
	urls,
	// setUrls, // setUrls might not be needed here if delete is removed
}: {
	urls: URLData[];
	setUrls: React.Dispatch<React.SetStateAction<URLData[]>>; // Keep for prop consistency if parent needs it
}) {
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
								Short URL (Link)
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
							<tr key={url.short_code}>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
									<div className="flex items-center">
										<span
											className="truncate max-w-xs"
											title={url.original_url}
										>
											{truncateUrl(url.original_url)}
										</span>
										<a
											href={url.original_url}
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
										<a
											href={url.display_short_url}
											target="_blank"
											rel="noopener noreferrer"
											className="hover:underline"
										>
											{url.display_short_url || url.short_code}
										</a>
										<button
											onClick={() =>
												copyToClipboard(url.display_short_url || url.short_code)
											}
											className="ml-2 text-gray-400 hover:text-gray-600"
											title="Copy short URL"
										>
											<Clipboard size={14} />
										</button>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
									{url.clicks}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
									{new Date(url.created_at).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
									{url.expiry_date
										? new Date(
												url.expiry_date * 1000,
											).toLocaleDateString()
										: "Never"}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
									<div className="flex items-center space-x-3">
										<button
											className="text-blue-600 hover:text-blue-800"
											title="Edit (Not implemented)"
											disabled
										>
											<Edit size={16} />
										</button>
										<button
											className="text-red-600 hover:text-red-800"
											title="Delete (Not implemented)"
											disabled
										>
											<Trash2 size={16} />
										</button>
										<button
											className="text-purple-600 hover:text-purple-800"
											title="Analytics (Not implemented)"
											disabled
										>
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
