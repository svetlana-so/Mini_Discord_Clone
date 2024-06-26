## Chat Application

This is a simple chat application built using React and Socket.io.

## Features

- Real-time Communication: Instant messaging with real-time updates.
- Multiple Channels: Users can join different channels to chat with others.
- User Authentication: Users can log in with a username to join the chat.
- User Status: Shows online status of users in the user list.
- Unread Message Indicator: Indicates unread messages in channels.

## Technologies Used

- React: Frontend framework for building user interfaces.
- Socket.io: Library for real-time web applications using WebSockets.
- Tailwind CSS: Utility-first CSS framework for styling.
- Node.js: JavaScript runtime for building server-side applications.
- Express: Web framework for Node.js used for handling API requests.

## Getting Started

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

```bash
cd server
```

Provide .env file with the port information like so:

```bash
PORT=8000
```

Start the server:

```bash
cd server
npm run server
```

Start the client:

```bash
cd client
npm run dev
```

Visit http://localhost:5173 in your browser to view the application.

## Future Development

- Private Messaging: Implement functionality for users to send private messages to each other.
- Message Editing and Deletion: Allow users to edit and delete their own messages.
- User Profiles: Create user profiles with additional information and customization options.
- Message Search: Enable users to search for messages within channels.
- File Sharing: Allow users to share files, such as images and documents, within channels.
- Accessibility Improvements: Ensure that the application is accessible to users with disabilities by implementing accessibility features and following best practices.
- Performance Optimization: Optimize the application's performance to improve loading times and responsiveness.
- Allowing user to log back in, or show messages that already exist on the channel upon logging in.
- Slim down custom UI components.
- Extract some logic into chat component which would only be mounted upon logging in to the app.
- Welcome message should be sent by the server instead of the user.
