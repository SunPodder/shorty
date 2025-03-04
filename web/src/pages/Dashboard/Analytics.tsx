import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

type Url = {
	id: string;
	originalUrl: string;
	shortUrl: string;
	clicks: number;
	createdAt: string;
	expiresAt: string | null;
};

export default function Analytics({ urls }: { urls: Url[] }) {
	const chartRef = useRef<HTMLCanvasElement>(null);
	const chartInstance = useRef<Chart | null>(null);

	const user = {
		username: "JohnDoe",
		totalUrls: 3,
		totalClicks: 209,
	};

	// Generate mock data for the last 7 days
	const generateClickData = () => {
		const dates = [];
		const clickData = [];

		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			dates.push(date.toLocaleDateString("en-US", { weekday: "short" }));
			// Generate random click data between 10-50
			clickData.push(Math.floor(Math.random() * 40) + 10);
		}

		return { dates, clickData };
	};

	useEffect(() => {
		if (chartRef.current) {
			// Destroy existing chart if it exists
			if (chartInstance.current) {
				chartInstance.current.destroy();
			}

			const { dates, clickData } = generateClickData();

			const ctx = chartRef.current.getContext("2d");
			if (ctx) {
				chartInstance.current = new Chart(ctx, {
					type: "line",
					data: {
						labels: dates,
						datasets: [
							{
								label: "Total Clicks",
								data: clickData,
								fill: true,
								backgroundColor: "rgba(59, 130, 246, 0.1)",
								borderColor: "rgba(59, 130, 246, 0.8)",
								tension: 0.4,
								borderWidth: 2,
								pointBackgroundColor: "rgba(59, 130, 246, 1)",
								pointRadius: 4,
								pointHoverRadius: 6,
							},
						],
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: {
								display: false,
							},
							tooltip: {
								backgroundColor: "rgba(0, 0, 0, 0.7)",
								padding: 10,
								titleColor: "#fff",
								bodyColor: "#fff",
								bodySpacing: 5,
								borderColor: "rgba(59, 130, 246, 0.8)",
								borderWidth: 1,
								callbacks: {
									label: function (context) {
										return `Clicks: ${context.parsed.y}`;
									},
								},
							},
						},
						scales: {
							x: {
								grid: {
									display: false,
								},
							},
							y: {
								beginAtZero: true,
								grid: {
									color: "rgba(0, 0, 0, 0.05)",
								},
							},
						},
					},
				});
			}
		}

		// Cleanup function
		return () => {
			if (chartInstance.current) {
				chartInstance.current.destroy();
			}
		};
	}, [urls]); // Re-render chart when urls change

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-gray-800">
					Analytics Overview
				</h2>
				<div className="inline-flex rounded-md shadow-sm">
					<button
						type="button"
						className="px-3 py-1 text-sm font-medium rounded-l-md border border-gray-200 bg-white text-blue-600 hover:bg-gray-50"
					>
						Week
					</button>
					<button
						type="button"
						className="px-3 py-1 text-sm font-medium border-t border-b border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
					>
						Month
					</button>
					<button
						type="button"
						className="px-3 py-1 text-sm font-medium rounded-r-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
					>
						Year
					</button>
				</div>
			</div>

			<div className="h-64 bg-white border border-gray-100 rounded-md">
				<canvas ref={chartRef}></canvas>
			</div>

			<div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<h3 className="text-sm text-gray-500 mb-1">
						Top Performing URL
					</h3>
					<p className="font-medium truncate">
						{urls.sort((a, b) => b.clicks - a.clicks)[0]
							?.shortUrl || "None"}
					</p>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<h3 className="text-sm text-gray-500 mb-1">
						Total Clicks Today
					</h3>
					<p className="font-medium">24</p>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<h3 className="text-sm text-gray-500 mb-1">
						Average Clicks
					</h3>
					<p className="font-medium">
						{urls.length > 0
							? Math.round(user.totalClicks / urls.length)
							: 0}
					</p>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<h3 className="text-sm text-gray-500 mb-1">Growth</h3>
					<p className="font-medium text-green-600">+12.5%</p>
				</div>
			</div>
		</div>
	);
}
