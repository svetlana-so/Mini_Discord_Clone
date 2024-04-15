/* eslint-disable react/prop-types */
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export default function UserBadge({ username }) {
  return (
    <div className="flex flex-row my-8 mx-2 rounded-lg border border-gray-600 px-3 py-1">
      <Avatar size="md" className="m-2">
        <AvatarImage src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png" />
      </Avatar>
      <div className="flex flex-col justify-center items-center">
        <Badge>{username} </Badge>
        <h1 className="text-xs text-gray-500">online</h1>
      </div>
    </div>
  );
}
