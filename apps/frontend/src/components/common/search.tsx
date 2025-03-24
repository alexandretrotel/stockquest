import { Search as SearchIcon } from "lucide-react";
import { useSearchStocks } from "@/features/search/hooks/use-search-stocks";
import { Input } from "@/components/ui/input";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useMemo, useState } from "react";
import { useSearchUsers } from "@/features/search/hooks/use-search-users";
import UserItem from "../../features/search/components/user-item";
import StockItem from "../../features/search/components/stock-item";

const PLACEHOLDER = "Search stocks, users...";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openCommand, setOpenCommand] = useState(false);

  const { results: stocksResults, isLoading: stocksLoading } =
    useSearchStocks(searchQuery);
  const { results: userResults, isLoading: usersLoading } =
    useSearchUsers(searchQuery);

  const loading = useMemo(
    () => usersLoading || stocksLoading,
    [usersLoading, stocksLoading],
  );

  return (
    <>
      <button
        onClick={() => setOpenCommand(true)}
        className="relative flex w-full items-center justify-center"
      >
        <div className="relative w-full">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            type="text"
            placeholder={PLACEHOLDER}
            className="hover:!bg-muted !py-2 !pr-4 !pl-10"
          />
        </div>
      </button>

      <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <CommandInput
          placeholder={PLACEHOLDER}
          value={searchQuery}
          onValueChange={(value) => setSearchQuery(value)}
        />

        <CommandList>
          <CommandEmpty>
            {loading ? "Loading..." : "No results found"}
          </CommandEmpty>

          {stocksResults && stocksResults.length > 0 && (
            <CommandGroup title="Quotes" heading="Quotes">
              {stocksResults?.map((quote) => {
                if (!quote.isYahooFinance) return null;
                return (
                  <StockItem
                    key={quote?.symbol}
                    quote={quote}
                    setOpenCommand={setOpenCommand}
                  />
                );
              })}
            </CommandGroup>
          )}

          {userResults && userResults.length > 0 && (
            <CommandGroup title="Users" heading="Users">
              {userResults?.map((user) => (
                <UserItem
                  key={user?.id}
                  user={user}
                  setOpenCommand={setOpenCommand}
                />
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
