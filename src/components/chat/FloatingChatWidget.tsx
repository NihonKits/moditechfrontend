import { useState, useEffect } from "react";
import "./FloatingChatWidget.css";
import logo from "../../assets/logo.png";
import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import useAuthStore from "../../zustand/AuthStore";
import { IMessage } from "../../Types";

const FloatingChatWidget = () => {
  const user = useAuthStore((state) => state.user);

  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  //

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const chatCollectionRef = collection(db, `conversation/${user}/messages`);

  useEffect(() => {
    const userQuery = query(chatCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
      const userMessages: IMessage[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as IMessage)
      );
      setMessages(userMessages);
    });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (input.trim().length === 0) return;

    setIsLoading(true);

    const message: IMessage = {
      id: (messages.length + 1).toString(),
      name: user || "",
      message: input,
      isUser: true,
      createdAt: new Date(),
    };

    try {
      await addDoc(chatCollectionRef, {
        ...message,
        name: user,
      });
      setInput("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error saving user message to Firestore:", error);
    }

    setMessages([...messages, message]);
  };

  //

  return (
    <div className={`floating-chat-widget ${isOpen ? "open" : ""}`}>
      <div className="chat-toggle-button" onClick={toggleChat}>
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <span className="chat-icon">💬</span>
        )}
      </div>
      {isOpen && (
        <div className="chat-box">
          <div className="chat-header">
            <div className="company-logo">
              <img src={logo} alt="Company Logo" className="logo-img" />
              <div className="company-name">Moditech</div>
            </div>
          </div>
          <div className="chat-area">
            {messages?.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.isUser ? "user-bubble" : "admin-bubble"
                } chat-bubble`}
              >
                {/* {message.isUser ? null : (
                  <img
                    src="admin-avatar.png"
                    alt="Admin Avatar"
                    className="avatar"
                  />
                )} */}
                <div className="bubble">{message.message}</div>
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              placeholder="Type your message..."
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="send-button"
              onClick={sendMessage}
              disabled={isLoading}
            >
              {isLoading ? "Please wait.." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatWidget;
