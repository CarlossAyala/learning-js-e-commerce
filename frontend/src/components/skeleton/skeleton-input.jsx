import { Skeleton } from "../ui/skeleton";

export const SkeletonInput = () => {
  return (
    <div>
      <Skeleton className="mb-2 h-3.5 w-16 rounded-md" />
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  );
};
