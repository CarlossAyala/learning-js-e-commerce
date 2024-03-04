import { useSearchParams } from "react-router-dom";
import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyPlaceholder,
} from "@/components";
import { useDocumentTitle } from "@/shared/hooks";
import { useClearHistory, useGetHistory, useRemoveHistory } from "../queries";
import { ProductCard } from "@/apps/customer/components";
import { Pagination } from "@/shared/components";

const groupByDate = (history) => {
  if (!Array.isArray(history) || history.length === 0) return [];

  const group = new Map();

  for (const _history of history) {
    const date = new Date(_history.lastSeenAt);
    date.setHours(0, 0, 0, 0);
    date.setDate(1);

    const ISODate = date.toISOString();
    const key = group.get(ISODate) ?? {
      date: ISODate,
      items: [],
    };
    key.items.push(_history);
    group.set(ISODate, key);
  }

  return Array.from(group.values());
};

const formatDate = (inputDate) => {
  const currentDate = new Date();
  const incomingDate = new Date(inputDate);

  const currentYear = currentDate.getFullYear();
  const inputYear = incomingDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const inputMonth = incomingDate.getMonth();

  if (currentYear === inputYear && currentMonth === inputMonth) {
    return "This month";
  } else if (currentYear === inputYear) {
    return incomingDate.toLocaleDateString("default", {
      month: "long",
    });
  } else {
    return incomingDate.toLocaleDateString("default", {
      year: "numeric",
      month: "long",
    });
  }
};

export const History = () => {
  useDocumentTitle("History");
  const [params] = useSearchParams();
  const { data, isLoading, isError, error } = useGetHistory(params.toString());

  const clearHistory = useClearHistory();
  const removeHistory = useRemoveHistory();

  const handleClear = () => {
    clearHistory.mutate(null, {
      onSuccess: () => {
        toast("History cleared");
      },
    });
  };

  const handleRemove = (productId) => {
    removeHistory.mutate(productId, {
      onSuccess: () => {
        toast("History removed");
      },
    });
  };

  const isEmpty = data?.rows.length === 0;
  const groupedHistory = groupByDate(data?.rows);

  return (
    <main className="container flex-1 space-y-4">
      <section className="mt-3 flex gap-4">
        <div className="scroll-m-20">
          <h1 className="text-3xl font-semibold tracking-tight">History</h1>
          <p className="mt-1 leading-tight text-muted-foreground">
            Here is the history of products that you viewed.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-auto shrink-0" size="icon">
              <EllipsisVerticalIcon className="h-5 w-5" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onSelect={handleClear}
              disabled={isLoading || isEmpty || isError}
            >
              Clear history
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      {isLoading ? (
        <ProductCard.Skeleton />
      ) : isError ? (
        <EmptyPlaceholder title="Error" description={error.message} />
      ) : isEmpty ? (
        <EmptyPlaceholder
          title="No history"
          description="You haven't viewed any product yet"
        />
      ) : (
        <section className="space-y-4">
          {groupedHistory.map((group) => (
            <div key={group.date} className="space-y-1">
              <p className="text-sm font-medium capitalize">
                {formatDate(group.date)}
              </p>
              <ol className="grid grid-cols-[repeat(auto-fill,minmax(144px,1fr))] gap-4">
                {group.items.map((_history, index) => (
                  <li key={index} className="relative">
                    <ProductCard product={_history.product} />
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      className="absolute right-2 top-2 bg-white shadow-md"
                      onClick={() => handleRemove(_history.product.id)}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>
      )}

      <Pagination count={data?.count} />
    </main>
  );
};
