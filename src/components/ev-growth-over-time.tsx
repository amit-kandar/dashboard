"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "./ui/card";
import { EVData } from "@/types/vehicles";
import { getEVGrowthOverTime } from "@/lib/functions";

export function EVGrowthOverTime({ vehicles }: { vehicles: EVData[] }) {
	const chartData = getEVGrowthOverTime(vehicles);

	const chartConfig = {
		bev: {
			label: "Battery EVs",
			color: "#4CAF50",
		},
		phev: {
			label: "Plug-in Hybrid EVs",
			color: "#FF9800",
		},
	} satisfies ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle>EV Growth Over Time</CardTitle>
				<CardDescription>Yearly BEV and PHEV Adoption</CardDescription>
			</CardHeader>
			<CardContent>
				{chartData.length === 0 ? (
					<p className="text-muted">No data available</p>
				) : (
					<ChartContainer config={chartConfig}>
						<BarChart accessibilityLayer data={chartData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="year"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent indicator="dashed" />
								}
							/>
							<Bar dataKey="bev" fill="#4CAF50" radius={4} />
							<Bar dataKey="phev" fill="#FF9800" radius={4} />
						</BarChart>
					</ChartContainer>
				)}
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					Trending up by 5.2% this year{" "}
					<TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-none text-muted-foreground">
					Showing BEV and PHEV growth over time.
				</div>
			</CardFooter>
		</Card>
	);
}
