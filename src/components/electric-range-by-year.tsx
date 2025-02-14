"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { EVData } from "@/types/vehicles";
import { getElectricityRangeByYear } from "@/lib/functions";

export function ElectricityRangeByYear({ vehicles }: { vehicles: EVData[] }) {
	const chartData = getElectricityRangeByYear(vehicles);

	const chartConfig = {
		avgRange: {
			label: "Avg. Electric Range",
			color: "#4CAF50",
		},
	} satisfies ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Electric Range Over Time</CardTitle>
				<CardDescription>Yearly Average Electric Range</CardDescription>
			</CardHeader>
			<CardContent>
				{chartData.length === 0 ? (
					<p className="text-muted">No data available</p>
				) : (
					<ChartContainer config={chartConfig}>
						<LineChart
							accessibilityLayer
							data={chartData}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="year"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
							/>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Line
								dataKey="avgRange"
								type="monotone"
								stroke="#4CAF50"
								strokeWidth={2}
								dot={false}
							/>
						</LineChart>
					</ChartContainer>
				)}
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					Trending up by 5.2% this year{" "}
					<TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-none text-muted-foreground">
					Showing the average electric range of EVs over time.
				</div>
			</CardFooter>
		</Card>
	);
}
