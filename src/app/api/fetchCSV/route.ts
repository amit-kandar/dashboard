import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function GET() {
	try {
		const response = await fetch(
			"https://raw.githubusercontent.com/vedant-patil-mapup/analytics-dashboard-assessment/refs/heads/main/data-to-visualize/Electric_Vehicle_Population_Data.csv"
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch CSV: ${response.statusText}`);
		}

		const csvText = await response.text();
		const parsedData = Papa.parse(csvText, {
			header: true,
			skipEmptyLines: true,
		}).data;

		return NextResponse.json({ data: parsedData });
	} catch (error) {
		console.error("Error fetching CSV:", error);
		return NextResponse.json(
			{ error: "Failed to fetch data" },
			{ status: 500 }
		);
	}
}
