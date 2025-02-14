"use client";

import { useState, useMemo } from "react";
import { DropdownMenuCheckboxes } from "@/components/dropdown-menu-checkbox";
import { ElectricityRangeByYear } from "@/components/electric-range-by-year";
import { EVGrowthOverTime } from "@/components/ev-growth-over-time";
import { EVsByManufacturer } from "@/components/evs-by-manufacturer";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { YearlyEVAdoptionRate } from "@/components/yearly-ev-adoption-rate";
import { Award, BatteryCharging, Car, CarFront } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CardSkeleton from "@/components/card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
	getAverageRange,
	getMostPopularModel,
	getTopBrand,
	getTotalEVs,
} from "@/lib/functions";
import { EVData } from "@/types/vehicles";

// Function to fetch vehicles from the API
const fetchVehicles = async (): Promise<{ data: EVData[] }> => {
	const response = await fetch("/api/fetchCSV");
	if (!response.ok) {
		throw new Error("Failed to fetch vehicles");
	}
	return response.json();
};

export default function Home() {
	const {
		data: vehicles,
		isError,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["vehicles"],
		queryFn: fetchVehicles,
		staleTime: 1000 * 60,
		retry: 3,
		refetchOnWindowFocus: false,
	});

	// State to track selected filters
	const [selectedFilters, setSelectedFilters] = useState({
		County: [] as string[],
		City: [] as string[],
		"Model Year": [] as string[],
	});

	// Function to update filters when selection changes
	const updateFilters = (
		key: keyof typeof selectedFilters,
		values: string[]
	) => {
		setSelectedFilters((prev) => ({
			...prev,
			[key]: values,
		}));
	};

	// Filter the data based on selected values
	const filteredData = useMemo(() => {
		if (!vehicles?.data) return [];
		return vehicles.data.filter((vehicle) => {
			const matchesCounty =
				selectedFilters.County.length === 0 ||
				selectedFilters.County.includes(vehicle.County);
			const matchesCity =
				selectedFilters.City.length === 0 ||
				selectedFilters.City.includes(vehicle.City);
			const matchesModelYear =
				selectedFilters["Model Year"].length === 0 ||
				selectedFilters["Model Year"].includes(vehicle["Model Year"]);
			return matchesCounty && matchesCity && matchesModelYear;
		});
	}, [vehicles, selectedFilters]);

	if (isError || !vehicles) {
		return (
			<div className="p-4">
				<p className="text-red-600 font-medium">
					Error: {error?.message || "An unknown error occurred"}
				</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="grid gap-4 p-4 pt-0">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{Array(4)
						.fill(null)
						.map((_, i) => (
							<CardSkeleton key={i} />
						))}
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<Skeleton className="h-64 w-full rounded-md" />
					<Skeleton className="h-64 w-full rounded-md" />
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<Skeleton className="h-64 w-full rounded-md" />
					<Skeleton className="h-64 w-full rounded-md" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">MapUp</h2>
				<div className="flex items-center space-x-2">
					<DropdownMenuCheckboxes
						title="County"
						vehicles={vehicles.data}
						selectedValues={selectedFilters.County}
						setSelectedValues={(values) =>
							updateFilters("County", values)
						}
					/>
					<DropdownMenuCheckboxes
						title="City"
						vehicles={vehicles.data}
						selectedValues={selectedFilters.City}
						setSelectedValues={(values) =>
							updateFilters("City", values)
						}
					/>
					<DropdownMenuCheckboxes
						title="Model Year"
						vehicles={vehicles.data}
						selectedValues={selectedFilters["Model Year"]}
						setSelectedValues={(values) =>
							updateFilters("Model Year", values)
						}
					/>
					<ModeToggle />
				</div>
			</div>
			<Tabs defaultValue="overview" className="space-y-4">
				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total EVs
								</CardTitle>
								<Car />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{getTotalEVs(filteredData)}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Top Brand
								</CardTitle>
								<Award />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{getTopBrand(filteredData)}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Avg Range
								</CardTitle>
								<BatteryCharging />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{getAverageRange(filteredData)} Km
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Most Popular Model
								</CardTitle>
								<CarFront />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{getMostPopularModel(filteredData)}
								</div>
							</CardContent>
						</Card>
					</div>
					<div className="grid gap-4">
						<div className="grid gap-4 grid-cols-2">
							<EVsByManufacturer
								vehicles={{ data: filteredData }}
							/>
							<YearlyEVAdoptionRate vehicles={filteredData} />
						</div>
						<div className="grid gap-4 grid-cols-2">
							<EVGrowthOverTime vehicles={filteredData} />
							<ElectricityRangeByYear vehicles={filteredData} />
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
