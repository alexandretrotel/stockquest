import { CommandItem } from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { UserSearchResult } from "@/actions/users.action";

interface UserItemProps {
  user: UserSearchResult[number];
  setOpenCommand: (open: boolean) => void;
}

export default function UserItem({ user, setOpenCommand }: UserItemProps) {
  const router = useRouter();

  return (
    <CommandItem
      title={user.name}
      value={JSON.stringify(user)}
      onSelect={() => {
        setOpenCommand(false);
        router.push(`/profile/${user.username}`);
      }}
    >
      <div className="flex w-full items-center justify-between gap-4">
        <span className="font-semibold">{user.name}</span>
        <span className="text-game-blue text-xs">@{user.username}</span>
      </div>
    </CommandItem>
  );
}
