import React, { useState } from "react";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = "/api/chatbot";
    const data = { message };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const jsonResponse = await response.json();
      setResponse(jsonResponse.message);
      setMessage('')
    } catch (error) {
      console.error(error);
      setResponse("Sorry, there was an error processing your request.");
    }
  };

  return (
    <div>
      <h1>Chatbot</h1>
      {response && <p>{response}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
