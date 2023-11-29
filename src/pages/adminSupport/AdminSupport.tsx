import "./AdminSupport.css";
import { useEffect, useState } from "react";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import AdminChat from "./AdminChat";
import { ConversationInterface, IMessage } from "../../Types";
import { Badge } from "@mui/material";

const AdminSupport = () => {
  const [conversations, setConversations] = useState<ConversationInterface[]>(
    []
  );

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationInterface>();
  const [unreadMessagesMap, setUnreadMessagesMap] = useState<
    Record<string, number>
  >({});

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

  useEffect(() => {
    if (selectedConversation) {
      markMessagesAsRead();
    }
  }, [selectedConversation]);

  useEffect(() => {
    const delay = 2500;
    // Fetch and store unread messages count for each conversation
    const promises = conversations.map(
      async (conversation: ConversationInterface) => {
        const chatCollectionRef = collection(
          db,
          `conversation/${conversation.id}/messages`
        );
        const chatQuery = query(chatCollectionRef, orderBy("createdAt", "asc"));

        const querySnapshot = await getDocs(chatQuery);
        const userMessages: IMessage[] = querySnapshot.docs.map(
          (doc: any) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as IMessage)
        );

        const unreadCount = userMessages.filter(
          (message) => message.isAdminReadTheMessage === false
        ).length;

        return { conversationId: conversation.id, unreadCount };
      }
    );

    console.log("checking here");
    const timeoutId = setTimeout(() => {
      Promise.all(promises).then((results) => {
        const unreadMap: Record<string, number> = {};
        results.forEach((result) => {
          unreadMap[result.conversationId] = result.unreadCount;
        });
        setUnreadMessagesMap(unreadMap);
      });
    }, delay);

    return () => clearTimeout(timeoutId);
  });

  useEffect(() => {
    // Fetch messages for the selected conversation
    if (selectedConversation) {
      const chatCollectionRef = collection(
        db,
        `conversation/${selectedConversation.id}/messages`
      );
      const chatQuery = query(chatCollectionRef, orderBy("createdAt", "asc"));

      const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
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
    }
  }, [selectedConversation]);

  const markMessagesAsRead = async () => {
    if (!selectedConversation) return;

    const userUnreadMessages = messages.filter(
      (message) => message.isAdminReadTheMessage === false
    );

    if (userUnreadMessages.length > 0) {
      const updatePromises = userUnreadMessages.map((unreadMessage) => {
        const messageRef = doc(
          db,
          `conversation/${selectedConversation.id}/messages`,
          unreadMessage.id
        );

        return updateDoc(messageRef, {
          isAdminReadTheMessage: true,
        });
      });

      try {
        await Promise.all(updatePromises);
        console.log("All messages marked as read on input focus");
      } catch (error) {
        console.error("Error marking messages as read in batch:", error);
      }
    }
  };

  return (
    <div className="chat">
      <div className="chat-container">
        <div className="chat-list">
          <h2>Available Chats:</h2>
          <ul>
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                onClick={() => {
                  setSelectedConversation(conversation);
                  markMessagesAsRead();
                }}
                className={
                  selectedConversation?.id === conversation.id ? "active" : ""
                }
              >
                <Badge
                  badgeContent={unreadMessagesMap[conversation.id] || 0}
                  invisible={unreadMessagesMap[conversation.id] === 0}
                  color="error"
                >
                  {conversation.id}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-messages">
          {selectedConversation && (
            <AdminChat
              selectedConversation={selectedConversation}
              markMessagesAsRead={markMessagesAsRead}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
