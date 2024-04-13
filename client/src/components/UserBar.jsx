/* eslint-disable react/prop-types */
import { Avatar, AvatarImage } from "./ui/avatar";

export default function UserBar({ users }) {
  return (
    <div className=" text-gray-100 p-2">
      <h4 className="mx-4 font-bold"> USERS</h4>
      <div
        className=" overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 40px)" }}
      >
        {users.map((user) => (
          <div
            key={user.userId}
            className={`flex items-center ${
              user.connected ? "text-green-500" : "text-red-500"
            }`}
          >
            <Avatar size="md" className="m-2">
              <AvatarImage
                src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png"
                alt={user.username}
              />
            </Avatar>

            <p>{user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
