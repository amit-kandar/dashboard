"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
import { getYearlyEVAdoptionRate } from "@/lib/functions";

const chartConfig = {
	bev: {
		label: "Battery Electric Vehicles (BEV)",
		color: "hsl(var(--chart-1))",
	},
	phev: {
		label: "Plug-in Hybrid Electric Vehicles (PHEV)",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export function YearlyEVAdoptionRate({ vehicles }: { vehicles: EVData[] }) {
	const data = getYearlyEVAdoptionRate(vehicles);

	return (
		<Card>
			<CardHeader>
				<CardTitle>EV Adoption Rate</CardTitle>
				<CardDescription>
					Yearly BEV & PHEV Adoption Trends
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<AreaChart
						accessibilityLayer
						data={data}
						margin={{ left: 12, right: 12 }}
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
							content={<ChartTooltipContent />}
						/>
						<defs>
							<linearGradient
								id="fillBEV"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor="hsl(var(--chart-1))"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="hsl(var(--chart-1))"
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient
								id="fillPHEV"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor="hsl(var(--chart-2))"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="hsl(var(--chart-2))"
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<Area
							dataKey="bev"
							type="natural"
							fill="url(#fillBEV)"
							fillOpacity={0.4}
							stroke="hsl(var(--chart-1))"
							stackId="a"
						/>
						<Area
							dataKey="phev"
							type="natural"
							fill="url(#fillPHEV)"
							fillOpacity={0.4}
							stroke="hsl(var(--chart-2))"
							stackId="a"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 font-medium leading-none">
							Trending up by 5.2% this month{" "}
							<TrendingUp className="h-4 w-4" />
						</div>
						<div className="flex items-center gap-2 leading-none text-muted-foreground">
							Yearly Data
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
