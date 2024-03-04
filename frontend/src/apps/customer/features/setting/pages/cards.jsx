import { useDocumentTitle } from "@/shared/hooks";
import { CardItem } from "../components/card-item";
import { useGetPaymentMethods } from "@/shared/features/payment-method";
import { Card, EmptyPlaceholder } from "@/components";

export const Cards = () => {
  useDocumentTitle("Cards");
  const { data: cards, isLoading, isError, error } = useGetPaymentMethods();

  const isEmpty = cards?.length === 0;

  return (
    <div className="max-w-2xl space-y-4">
      <section>
        <h3 className="text-lg font-medium">Cards</h3>
        <p className="text-sm text-muted-foreground">Manage your cards.</p>
      </section>

      <section>
        {isLoading ? (
          <Card className="divide-y divide-black/10">
            <CardItem.Skeleton />
            <CardItem.Skeleton />
            <CardItem.Skeleton />
          </Card>
        ) : isError ? (
          <EmptyPlaceholder title={error.name} description={error.message} />
        ) : isEmpty ? (
          <EmptyPlaceholder
            title="No cards"
            description="You don't have any cards yet."
          />
        ) : (
          <Card className="divide-y divide-black/10">
            {cards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </Card>
        )}
      </section>
    </div>
  );
};
