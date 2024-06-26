/* eslint-disable react/prop-types */
import { Avatar, AvatarImage } from './ui/avatar';

const avatars = [
  'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-round-color-icon.png',
  'https://banner2.cleanpng.com/20190826/qxz/transparent-pink-face-cartoon-head-nose-5d652dd17900c6.9396615115669119534956.jpg',
  'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-round-line-color-icon.png'
];

export default function UserBar({ users }) {
  return (
    <div className=" text-gray-100 my-4">
      <h4 className="mx-4 font-bold text-sm truncate">USERS</h4>
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 40px)' }}>
        {users.map((user) => (
          <div
            key={user.userId}
            className={`flex items-center ${user.connected ? 'text-green-500' : 'text-red-500'}`}>
            <Avatar size="md" className="m-2">
              <AvatarImage src={avatars[user.avatar - 1]} alt={user.username} />
            </Avatar>

            <p className="flex overflow-scroll text-sm" title={user.username}>
              {user.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
