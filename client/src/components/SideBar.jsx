/* eslint-disable react/prop-types */
import { Avatar, AvatarImage } from './ui/avatar';

export default function SideBar({ leaveTheServer, logout }) {
  return (
    <div className="flex flex-col items-center justify-between p-4 gap-2 side-bar h-full">
      <Avatar size="md" className="w-16 h-16">
        {<AvatarImage src="./src/assests/discord-white-icon.png" alt="discord icon" />}
      </Avatar>
      <div className="flex flex-col gap-2">
        {' '}
        <button className="p-2 rounded-md w-20 text-xs font-semibold logout-btn" onClick={logout}>
          Logout
        </button>
        <button
          className="p-2 rounded-md w-20 text-xs font-semibold bg-red-500"
          onClick={leaveTheServer}>
          Leave server
        </button>
      </div>
    </div>
  );
}
