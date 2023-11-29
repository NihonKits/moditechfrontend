import { useState, useEffect } from "react";
import "./FloatingChatWidget.css";
import logo from "../../assets/logo.png";
import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import useAuthStore from "../../zustand/AuthStore";
import { IMessage } from "../../Types";
import { Badge } from "@mui/material";

const FloatingChatWidget = () => {
  const user = useAuthStore((state) => state.user);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userHasUnreadBadge, setUserHasUnreadBadge] = useState<number>(0);

  const handleInputFocus = async () => {
    const userUnreadMessages = messages.filter(
      (message) => !message.isUserReadTheMessage
    );

    console.log("userUnreadMessages", userUnreadMessages);

    if (userUnreadMessages.length > 0) {
      const updatePromises = userUnreadMessages.map((unreadMessage) => {
        const messageRef = doc(
          db,
          `conversation/${user}/messages`,
          unreadMessage.id
        );

        return updateDoc(messageRef, {
          isUserReadTheMessage: true,
        });
      });

      try {
        // Wait for all updates to complete
        await Promise.all(updatePromises);
        console.log("All messages marked as read on input focus");
      } catch (error) {
        console.error("Error marking messages as read on input focus:", error);
      }
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const chatCollectionRef = collection(db, `conversation/${user}/messages`);
  const userQuery = query(chatCollectionRef, orderBy("createdAt", "asc"));

  useEffect(() => {
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
      const userMessages: IMessage[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as IMessage)
      );

      setMessages(userMessages);

      const otherUserMessages = userMessages.filter(
        (message) => message.isUserReadTheMessage === false
      );

      setUserHasUnreadBadge(otherUserMessages.length);
    });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (input.trim().length === 0) return;

    setIsLoading(true);

    // const message: IMessage = {
    //   id: (messages.length + 1).toString(),
    //   name: user || "",
    //   message: input,
    //   isUser: true,
    //   createdAt: new Date(),
    //   isUserReadTheMessage: true,
    //   isAdminReadTheMessage: false,
    // };

    const message: any = {
      name: user || "",
      message: input,
      isUser: true,
      createdAt: new Date(),
      isUserReadTheMessage: true,
      isAdminReadTheMessage: false,
    };

    const userDocRef = doc(db, "conversation", user || "");

    try {
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {});
      }

      await addDoc(chatCollectionRef, message);
      setInput("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error saving user message to Firestore:", error);
    }

    setMessages([...messages, message]);
  };

  return (
    // <>
    <div className={`floating-chat-widget ${isOpen ? "open" : ""}`}>
      <Badge
        badgeContent={userHasUnreadBadge}
        color="error"
        invisible={userHasUnreadBadge ? false : true}
      >
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
                onFocus={handleInputFocus}
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
      </Badge>
    </div>
  );
};

export default FloatingChatWidget;
