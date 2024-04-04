import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarUrl } from "@/lib/utils";
import Link from "next/link";

export default function Author({
  fullName,
  username,
  avatar,
}: {
  fullName: string;
  username: string;
  avatar: string;
}) {
  const avatarUrl = generateAvatarUrl(avatar);

  return (
    <div className="flex items-center gap-3">
      <Avatar className="w-[30px] h-[30px]">
        <AvatarImage src={avatarUrl} />
      </Avatar>

      <div className="font-medium flex flex-col text-zinc-700">
        <p className="text-[16px]">{fullName}</p>
        <Link href={`/user/${username}`} className="text-[13px]">
          @<span className="underline">{username}</span>
        </Link>
      </div>
    </div>
  );
}
