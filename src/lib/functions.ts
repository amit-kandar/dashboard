import { EVData } from "@/types/vehicles";

export const getTopBrand = (data: EVData[]): string => {
	const brandCount: Record<string, number> = {};

	data.forEach((ev) => {
		brandCount[ev.Make] = (brandCount[ev.Make] || 0) + 1;
	});

	return Object.entries(brandCount).sort((a, b) => b[1] - a[1])[0][0]; // Brand with the highest count
};

export const getAverageRange = (data: EVData[]): number => {
	const totalRange = data.reduce(
		(sum, ev) => sum + parseInt(ev["Electric Range"] || "0"),
		0
	);
	return totalRange / data.length;
};

export const getMostPopularModel = (data: EVData[]): string => {
	const modelCount: Record<string, number> = {};

	data.forEach((ev) => {
		modelCount[ev.Model] = (modelCount[ev.Model] || 0) + 1;
	});

	return Object.entries(modelCount).sort((a, b) => b[1] - a[1])[0][0];
};

export const getTotalEVs = (data: EVData[]): number => {
	const uniqueVehicles = new Set(data.map((ev) => ev["VIN (1-10)"]));
	return uniqueVehicles.size;
};

export const getEVsByManufacturer = (
	data: EVData[]
): { browser: string; visitors: number; fill: string }[] => {
	const manufacturerCount: Record<string, number> = {};

	data.forEach((ev) => {
		manufacturerCount[ev.Make] = (manufacturerCount[ev.Make] || 0) + 1;
	});

	// Generate distinct HEX colors using HSL to HEX conversion
	const generateColor = (index: number): string => {
		const hue = (index * 137) % 360; // Spread colors across the hue spectrum
		return `#${hslToHex(hue, 70, 50)}`; // Convert HSL to HEX
	};

	return Object.entries(manufacturerCount).map(([make, count], index) => ({
		browser: make.toLowerCase(),
		visitors: count,
		fill: generateColor(index), // Assign HEX color
	}));
};

const hslToHex = (h: number, s: number, l: number): string => {
	s /= 100;
	l /= 100;

	const k = (n: number) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) =>
		Math.round(
			255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)))
		);

	return ((1 << 24) | (f(0) << 16) | (f(8) << 8) | f(4))
		.toString(16)
		.slice(1);
};

export const getYearlyEVAdoptionRate = (
	data: EVData[]
): { year: string; bev: number; phev: number }[] => {
	const yearCount: Record<string, { bev: number; phev: number }> = {};

	data.forEach((ev) => {
		const year = ev["Model Year"];
		const type = ev["Electric Vehicle Type"];

		if (!yearCount[year]) {
			yearCount[year] = { bev: 0, phev: 0 };
		}

		if (type === "Battery Electric Vehicle (BEV)") {
			yearCount[year].bev += 1;
		} else if (type === "Plug-in Hybrid Electric Vehicle (PHEV)") {
			yearCount[year].phev += 1;
		}
	});

	return Object.entries(yearCount).map(([year, counts]) => ({
		year,
		bev: counts.bev,
		phev: counts.phev,
	}));
};

export const getEVGrowthOverTime = (
	data: EVData[]
): { year: string; bev: number; phev: number }[] => {
	const yearlyData: Record<string, { bev: number; phev: number }> = {};

	data.forEach((ev) => {
		if (!ev["Model Year"] || !ev["Electric Vehicle Type"]) return;

		const year = ev["Model Year"].toString(); // Convert to string for consistency

		if (!yearlyData[year]) {
			yearlyData[year] = { bev: 0, phev: 0 };
		}

		if (ev["Electric Vehicle Type"] === "Battery Electric Vehicle (BEV)") {
			yearlyData[year].bev += 1;
		} else if (
			ev["Electric Vehicle Type"] ===
			"Plug-in Hybrid Electric Vehicle (PHEV)"
		) {
			yearlyData[year].phev += 1;
		}
	});

	const formattedData = Object.entries(yearlyData).map(
		([year, { bev, phev }]) => ({
			year,
			bev,
			phev,
		})
	);

	return formattedData;
};

export const getElectricityRangeByYear = (
	data: EVData[]
): { year: string; avgRange: number }[] => {
	const rangeData: Record<string, { total: number; count: number }> = {};

	data.forEach((ev) => {
		const year = ev["Model Year"]?.toString(); // Convert year to string
		const range = parseInt(ev["Electric Range"] || "0", 10);

		if (!year || isNaN(range)) return; // Ensure valid data

		if (!rangeData[year]) {
			rangeData[year] = { total: 0, count: 0 };
		}

		rangeData[year].total += range;
		rangeData[year].count += 1;
	});

	return Object.entries(rangeData)
		.map(([year, { total, count }]) => ({
			year,
			avgRange: count ? Math.round(total / count) : 0,
		}))
		.sort((a, b) => parseInt(a.year) - parseInt(b.year)); // Ensure data is sorted by year
};

export const getEVDataList = (data: EVData[], name: keyof EVData): string[] => {
	if (!["County", "City", "Model Year"].includes(name)) {
		throw new Error(
			"Invalid filter name. Use 'County', 'City', or 'Model Year'."
		);
	}

	const uniqueValues = new Set<string>();

	data.forEach((ev) => {
		const value = ev[name];
		if (value) {
			uniqueValues.add(value.toString());
		}
	});

	return Array.from(uniqueValues);
};
