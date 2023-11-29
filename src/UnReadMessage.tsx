import { onSnapshot, collection } from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { useQuery } from "react-query";

const fetchUnreadMessages = async (userId: string) => {
  const collectionRef = collection(db, `conversation/${userId}/messages`);
  let unreadMessages = 0;

  try {
    await onSnapshot(collectionRef, (snapshot) => {
      unreadMessages = snapshot.docs.filter((doc) => !doc.data().read).length;
    });
  } catch (error) {
    console.error("Error fetching unread messages:", error);
  }

  return unreadMessages;
};

export const useUnreadMessages = (userId: string) => {
  return useQuery(
    ["unreadMessages", userId],
    () => fetchUnreadMessages(userId),
    {
      refetchInterval: 5000,
    }
  );
};
