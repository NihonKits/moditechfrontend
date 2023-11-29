import {
  collection,
  query,
  orderBy,
  DocumentData,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import { ConversationInterface, IMessage } from "../../Types";
import { useEffect, useState } from "react";
import useAuthStore from "../../zustand/AuthStore";

interface Prop {
  selectedConversation: ConversationInterface;
  markMessagesAsRead: () => void;
}

const AdminChat = ({ selectedConversation, markMessagesAsRead }: Prop) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [replyInput, setReplyInput] = useState<string>("");

  const user = useAuthStore((state) => state.user);

  const handleReply = async () => {
    if (!selectedConversation || !replyInput.trim()) return;

    try {
      const messagesRef = collection(
        db,
        `conversation/${selectedConversation.id}/messages`
      );

      await addDoc(messagesRef, {
        name: user,
        message: replyInput,
        createdAt: serverTimestamp(),
        isUserReadTheMessage: false,
        isAdminReadTheMessage: true,
      });

      setReplyInput("");
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  useEffect(() => {
    if (selectedConversation.name !== "") {
      const collectionRef = collection(
        db,
        `conversation/${selectedConversation.id}/messages`
      );
      const q = query(collectionRef, orderBy("createdAt", "asc"));

      const unsubscribe = onSnapshot(q, (messages: DocumentData) => {
        const messagesData = messages.docs.map((doc: any) => {
          return { id: doc.id, ...doc.data() };
        });
        setMessages(messagesData);
      });

      return unsubscribe;
    } else {
      return;
    }
  }, [selectedConversation.id]);

  return (
    <div className="admin-chat">
      {messages ? (
        <>
          <ul className="messages-container">
            {messages.map((message, index) => (
              <li
                key={index}
                className={
                  message.name === user
                    ? "message-item-right"
                    : "message-item-left"
                }
              >
                <h3>{message.name}</h3>
                <span>{message.message}</span>
              </li>
            ))}
          </ul>
          <div className="reply-input">
            <input
              type="text"
              placeholder="Type your reply..."
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              onFocus={markMessagesAsRead}
            />
            <button onClick={handleReply}>Reply</button>
          </div>
        </>
      ) : (
        <p>Select a chat to view messages.</p>
      )}
    </div>
  );
};

export default AdminChat;
