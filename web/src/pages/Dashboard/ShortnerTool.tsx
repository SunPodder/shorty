import { Check, Clipboard, Globe } from "lucide-react";
import { FormEvent, useState } from "react";

export default function ShortnerTool() {
	const [url, setUrl] = useState("");
	const [customAlias, setCustomAlias] = useState("");
	const [newShortUrl, setNewShortUrl] = useState("");
	const [showCopied, setShowCopied] = useState(false);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			setShowCopied(true);
			setTimeout(() => setShowCopied(false), 2000);
		});
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// This would be an API call in a real application
		const newUrl = {
			// id: (urls.length + 1).toString(),
			originalUrl: url,
			shortUrl: customAlias
				? `shorty.io/${customAlias}`
				: `shorty.io/${Math.random().toString(36).substr(2, 6)}`,
			clicks: 0,
			createdAt: new Date().toISOString(),
			expiresAt: null,
		};

		setNewShortUrl(newUrl.shortUrl);
		// setUrls([...urls, newUrl]);
		setUrl("");
		setCustomAlias("");
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md mb-8">
			<h2 className="text-xl font-semibold text-gray-800 mb-4">
				Shorten a New URL
			</h2>
			<form
				onSubmit={handleSubmit}
				className="space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-4"
			>
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

				<div className="md:col-span-4">
					<label
						htmlFor="custom-alias"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Custom alias (optional)
					</label>
					<div className="flex rounded-md shadow-sm">
						<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
							shorty.io/
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

				<div className="md:col-span-2 md:flex md:items-end">
					<button
						type="submit"
						className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 md:mt-7"
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
					<a href="#" className="text-blue-600 hover:underline">
						{newShortUrl}
					</a>
				</div>
			)}
		</div>
	);
}
