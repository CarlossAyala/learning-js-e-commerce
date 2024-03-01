import { useNavigate } from "react-router-dom";
import { AddressItem } from "../components/address-item";
import { addressActionRoutes } from "../utils";
import { useGetAddresses } from "../queries";
import { useDocumentTitle } from "@/shared/hooks";
import { Button, Card, EmptyPlaceholder } from "@/components";

const Addresses = () => {
  useDocumentTitle("Addresses");
  const navigate = useNavigate();

  const { data: addresses, isLoading, isError, error } = useGetAddresses();

  const handleNewAddress = () => {
    navigate(addressActionRoutes.new);
  };

  const isEmpty = addresses?.length === 0;

  return (
    <div className="max-w-2xl space-y-4">
      <section className="flex justify-between gap-x-4">
        <div className="grow">
          <h3 className="text-lg font-medium">Addresses</h3>
          <p className="text-sm text-muted-foreground">Manage your addresses</p>
        </div>
        <Button className="shrink-0" type="button" onClick={handleNewAddress}>
          New
        </Button>
      </section>

      <section>
        {isLoading ? (
          <Card className="divide-y divide-black/10">
            <AddressItem.Skeleton />
            <AddressItem.Skeleton />
            <AddressItem.Skeleton />
          </Card>
        ) : isError ? (
          <EmptyPlaceholder title={error.name} description={error.message} />
        ) : isEmpty ? (
          <EmptyPlaceholder
            title="No addresses"
            description="You don't have any address yet."
          />
        ) : (
          <Card className="divide-y divide-black/10">
            {addresses.map((address) => (
              <AddressItem key={address.id} address={address} />
            ))}
          </Card>
        )}
      </section>
    </div>
  );
};

export default Addresses;
