/* eslint-disable react/prop-types */
import { Avatar, AvatarImage } from "./ui/avatar";

export default function SideBar({leaveTheServer, logout}) {
  return (
    <div className="flex flex-col items-center justify-between p-8 gap-2 w-20 side-bar">
            <Avatar size="md" className="">
              {
                <AvatarImage
                  src="./src/assests/discord-white-icon.png"
                  alt="discord icon"
                />
              }
            </Avatar>
            <div className="flex flex-col gap-2"> <button
              className="p-2 rounded-md w-16 logout-btn"
              onClick={logout}
            >
              Logout
            </button>
            <button
              className="p-2 rounded-md w-16 bg-red-500"
              onClick={leaveTheServer}
            >
              Leave server
            </button></div>
           
          </div>
  );
}
