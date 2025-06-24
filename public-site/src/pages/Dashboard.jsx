import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import NavBar from "../components/NavBar";

function Dashboard() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({
    message: "",
    mood: "",
  });

  const axiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: "http://localhost:3000",
        withCredentials: true,
      }),
    []
  );

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/");
      }
    };

    fetchUserData();
  }, [axiosInstance, navigate]);

  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userMessage = {
      role: "user",
      content: formInput.message,
      mood: formInput.mood,
    };

    setChats((prevChats) => [...prevChats, userMessage]);

    try {
      const response = await axios.post(
        "http://localhost:3000/chat",
        formInput
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.mood,
      };

      setChats((prevChats) => [...prevChats, aiMessage]);
      setFormInput({ message: "", mood: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "system",
        content: "Sorry, something went wrong. Please try again.",
      };
      setChats((prevChats) => [...prevChats, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <NavBar />

      <div className="chat-window">
        {chats.map((chat, index) => (
          <div key={index} className={`chat-message ${chat.role}`}>
            {chat.role === "user" && <strong>You ({chat.mood}): </strong>}
            {chat.role === "assistant" && <strong>Assistant: </strong>}
            <p>{chat.content}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            <p>
              <i>Typing...</i>
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          placeholder="Type your message"
          value={formInput.message}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <select
          name="mood"
          value={formInput.mood}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="">Select Mood</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="overwhelmed">Overwhelmed</option>
          <option value="fear">Fear</option>
          <option value="calm">Calm</option>
          <option value="bored">Bored</option>
          <option value="excited">Excited</option>
          <option value="lonely">Lonely</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>

      <button onClick={() => navigate("/")}>Logout</button>
    </div>
  );
}

export default Dashboard;
