import "./AdminSupport.css";
import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import AdminChat from "./AdminChat";
import { ConversationInterface } from "../../Types";

const AdminSupport = () => {
  const [conversations, setConversations] = useState<ConversationInterface[]>(
    []
  );

  const [selectedConversation, setSelectedConversation] =
    useState<ConversationInterface>();

  useEffect(() => {
    const collectionRef = collection(db, "conversation");

    const unsubscribe = onSnapshot(collectionRef, (snapshot: any) => {
      const conversationData = snapshot.docs.map((doc: any) => {
        return { id: doc.id, ...doc.data() };
      });
      setConversations(conversationData);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-list">
        <h2>Available Chats:</h2>
        <ul>
          {conversations.map((conversation) => (
            <li
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={
                selectedConversation?.id === conversation.id ? "active" : ""
              }
            >
              {conversation.id}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        {selectedConversation && (
          <AdminChat selectedConversation={selectedConversation} />
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
