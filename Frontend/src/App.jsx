import { useEffect, useState } from "react";
import api from "./api/axios";

function App() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    api.post("/students/register", {
      test: "frontend"
    })
      .then(res => setMessage(res.data.message))
      .catch(err => {
        console.error(err);
        setMessage("Connection failed");
      });
  }, []);

  return <h1>{message}</h1>;
}

export default App;
