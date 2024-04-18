/* eslint-disable react/prop-types */
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Messages({
  handleSubmit,
  message,
  handleMessageChange,
  chosenChannel,
}) {
  return (
    <div className="w-full my-6 text-gray-100 p-2 flex flex-row">
      <form onSubmit={handleSubmit} className="w-full flex">
        <Input
          placeholder={`Messages #${chosenChannel}`}
          value={message}
          onChange={handleMessageChange}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
