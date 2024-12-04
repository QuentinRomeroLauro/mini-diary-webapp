import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  Timestamp,
  orderBy,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from './authService';
import { DiaryEntry } from '../types/diary';
import { encryptEntry, decryptEntry } from './encryptionService';

interface EncryptedEntry {
  encryptedData: string;
  salt: string;
  iv: string;
  date: Date;
  userId: string;
}

export const createEntry = async (
  userId: string, 
  entry: Omit<DiaryEntry, 'id'>,
  encryptionKey: string
) => {
  const entriesRef = collection(db, 'entries');
  
  // Encrypt the entry content
  const encrypted = await encryptEntry(entry.content, encryptionKey);
  
  const docRef = await addDoc(entriesRef, {
    userId,
    date: Timestamp.fromDate(entry.date),
    ...encrypted,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  
  return docRef.id;
};

export const updateEntry = async (
  userId: string, 
  entryId: string, 
  updates: Partial<DiaryEntry>,
  encryptionKey: string
) => {
  const entryRef = doc(db, 'entries', entryId);
  
  let updateData: any = {
    updatedAt: Timestamp.now()
  };

  if (updates.content) {
    const encrypted = await encryptEntry(updates.content, encryptionKey);
    updateData = { ...updateData, ...encrypted };
  }

  if (updates.date) {
    updateData.date = Timestamp.fromDate(updates.date);
  }

  await updateDoc(entryRef, updateData);
};

export const deleteEntry = async (entryId: string) => {
  const entryRef = doc(db, 'entries', entryId);
  await deleteDoc(entryRef);
};

export const getUserEntries = async (userId: string, encryptionKey: string) => {
  const entriesRef = collection(db, 'entries');
  const q = query(
    entriesRef, 
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const entries = await Promise.all(
    querySnapshot.docs.map(async doc => {
      const data = doc.data() as EncryptedEntry;
      const decryptedContent = await decryptEntry(
        data.encryptedData,
        encryptionKey,
        data.salt,
        data.iv
      );

      return {
        id: doc.id,
        content: decryptedContent,
        date: (data.date as unknown as Timestamp).toDate()
      } as DiaryEntry;
    })
  );

  return entries;
};

// Chat history persistence with encryption
export const saveChatHistory = async (
  userId: string, 
  messages: any[],
  encryptionKey: string
) => {
  const chatRef = doc(db, 'chats', userId);
  const encrypted = await encryptEntry(JSON.stringify(messages), encryptionKey);
  
  await updateDoc(chatRef, {
    ...encrypted,
    updatedAt: Timestamp.now()
  });
};

export const getChatHistory = async (userId: string, encryptionKey: string) => {
  const chatRef = doc(db, 'chats', userId);
  const chatDoc = await getDocs(query(collection(db, 'chats'), where('userId', '==', userId)));
  
  if (chatDoc.empty) {
    await addDoc(collection(db, 'chats'), {
      userId,
      encryptedData: '',
      salt: '',
      iv: '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return [];
  }

  const data = chatDoc.docs[0].data();
  if (!data.encryptedData) return [];

  const decrypted = await decryptEntry(
    data.encryptedData,
    encryptionKey,
    data.salt,
    data.iv
  );

  return JSON.parse(decrypted);
};

export const initializeUserData = async (userId: string) => {
  // Initialize chat document
  const chatRef = doc(db, 'chats', userId);
  const chatDoc = await getDoc(chatRef);
  
  if (!chatDoc.exists()) {
    await setDoc(chatRef, {
      userId,
      encryptedData: '',
      salt: '',
      iv: '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
}; 