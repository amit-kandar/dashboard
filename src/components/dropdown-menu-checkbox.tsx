"use client";

import * as React from "react";
// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getEVDataList } from "@/lib/functions";
import { EVData } from "@/types/vehicles";

interface DropdownMenuCheckboxesProps {
	title: keyof EVData;
	vehicles: EVData[];
	selectedValues: string[];
	setSelectedValues: (values: string[]) => void;
}

export function DropdownMenuCheckboxes({
	title,
	vehicles,
	selectedValues,
	setSelectedValues,
}: DropdownMenuCheckboxesProps) {
	const uniqueValues = React.useMemo(
		() => getEVDataList(vehicles, title),
		[vehicles, title]
	);

	const handleToggle = (value: string) => {
		const newValues = selectedValues.includes(value)
			? selectedValues.filter((v) => v !== value)
			: [...selectedValues, value];
		setSelectedValues(newValues);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">{title}</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Select {title}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<ScrollArea className="h-[200px] w-full rounded-md border p-4">
					{uniqueValues.map((value) => (
						<DropdownMenuCheckboxItem
							key={value}
							checked={selectedValues.includes(value)}
							onCheckedChange={() => handleToggle(value)}
						>
							{value}
						</DropdownMenuCheckboxItem>
					))}
				</ScrollArea>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
