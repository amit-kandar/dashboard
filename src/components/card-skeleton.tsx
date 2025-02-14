import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => {
	return (
		<div className="p-4 border rounded-md shadow-md">
			<Skeleton className="h-6 w-32 mb-4" />
			<Skeleton className="h-12 w-full" />
		</div>
	);
};

export default CardSkeleton;
