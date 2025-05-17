import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

function generateClickData(clicks: ClickData[]): [number[], string[]] {
	const last7Days = Array.from({ length: 7 }, (_, i) => {
		const d = new Date();
		d.setDate(d.getDate() - i);
		return d;
	});

	const clickCount = last7Days.map((d) => {
		const date = d.toISOString().split("T")[0];
		const count = clicks.filter((c) => c.created === date).length;
		return count;
	});

	const day = last7Days.map((d) => {
		return d.toLocaleDateString("en-US", { weekday: "short" });
	});

	return [clickCount, day];
}

function calculateSevenDayGrowth(clicks: ClickData[]): {
	growth: number;
	isPositive: boolean | null;
	formattedGrowth: string;
} {
	const today = new Date();

	// Get dates for current 7 days and previous 7 days
	const current7DaysDates = Array.from({ length: 7 }, (_, i) => {
		const d = new Date(today);
		d.setDate(d.getDate() - i);
		return d.toISOString().split("T")[0];
	});

	const previous7DaysDates = Array.from({ length: 7 }, (_, i) => {
		const d = new Date(today);
		d.setDate(d.getDate() - (i + 7));
		return d.toISOString().split("T")[0];
	});

	// Count clicks for both periods
	const current7DaysClicks = clicks.filter((click) =>
		current7DaysDates.includes(click.created),
	).length;

	const previous7DaysClicks = clicks.filter((click) =>
		previous7DaysDates.includes(click.created),
	).length;

	// Calculate growth rate
	// If previous period had 0 clicks, set growth to 100% if there are clicks now
	let growthRate = 0;

	if (previous7DaysClicks === 0) {
		growthRate = current7DaysClicks > 0 ? 100 : 0;
	} else {
		growthRate =
			((current7DaysClicks - previous7DaysClicks) / previous7DaysClicks) *
			100;
	}

	// Format to one decimal place
	const formattedGrowth = `${Math.abs(growthRate).toFixed(1)}%`;	

	return {
		growth: growthRate,
		isPositive: growthRate == 0 ? null : growthRate > 0,
		formattedGrowth,
	};
}

export default function Analytics({ urls }: { urls: URLData[] }) {
	const chartRef = useRef<HTMLCanvasElement>(null);
	const chartInstance = useRef<Chart | null>(null);
	const [growthData, setGrowthData] = useState<{
		growth: number;
		isPositive: boolean | null;
		formattedGrowth: string;
	}>({
		growth: 0,
		isPositive: null,
		formattedGrowth: "0%",
	});
	const [clicks, setClicks] = useState<ClickData[]>([]);

	useEffect(() => {
		if (clicks.length > 0) {
			const growth = calculateSevenDayGrowth(clicks);
			setGrowthData(growth);
		}
	}, [clicks]);

	useEffect(() => {
		if (chartRef.current) {
			// Destroy existing chart if it exists
			if (chartInstance.current) {
				chartInstance.current.destroy();
			}

			const [clickCount, days] = generateClickData(clicks);

			const ctx = chartRef.current.getContext("2d");
			if (ctx) {
				chartInstance.current = new Chart(ctx, {
					type: "line",
					data: {
						labels: days,
						datasets: [
							{
								label: "Total Clicks",
								data: clickCount,
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
	}, [urls, clicks]); // Re-render chart when urls change

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
							?.shortCode || "None"}
					</p>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<h3 className="text-sm text-gray-500 mb-1">
						Total Clicks Today
					</h3>
					<p className="font-medium">{clicks.length}</p>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<h3 className="text-sm text-gray-500 mb-1">
						Average Clicks
					</h3>
					<p className="font-medium">
						{urls.length > 0
							? Math.round(clicks.length / urls.length)
							: 0}
					</p>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<h3 className="text-sm text-gray-500 mb-1">
						Growth (7-day)
					</h3>
					<p
						className={`font-medium ${growthData.isPositive == null ? "text-gray-400" : growthData.isPositive ? "text-green-600" : "text-red-600"}`}
					>
						{growthData.isPositive == null ? "" : growthData.isPositive ? "+" : "-"}
						{growthData.formattedGrowth}
					</p>
				</div>
			</div>
		</div>
	);
}
