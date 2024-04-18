/* eslint-disable react/prop-types */
export default function Login({ handleLogin, username, setUsername }) {
  return (
    <form
      onSubmit={handleLogin}
      className="h-full flex justify-center items-center login"
    >
      <input
        className="text-gray-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        className="text-gray-200 font-semibold mx-8 login-btn px-4 py-2 rounded-lg"
        type="submit"
      >
        Login
      </button>
    </form>
  );
}
