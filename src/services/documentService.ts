import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { DocumentData } from '../types';

export interface FirestoreDocumentRecord {
  id: string;
  ownerId: string;
  title: string;
  type: string;
  content: DocumentData;
  createdAt: any;
  updatedAt: any;
}

export const documentService = {
  // Fetch all documents owned by specific user
  async getUserDocuments(userId: string): Promise<DocumentData[]> {
    if (!isFirebaseConfigured || !db || !userId) {
      // Fallback to local draft cache if offline/unconfigured
      try {
        const local = localStorage.getItem(`draft_docs_${userId}`);
        return local ? JSON.parse(local) : [];
      } catch (e) {
        return [];
      }
    }

    try {
      const q = query(
        collection(db, 'documents'),
        where('ownerId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const docs: DocumentData[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        if (data.content) {
          docs.push({
            ...data.content,
            id: d.id,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
          });
        }
      });
      return docs;
    } catch (err) {
      console.error('Failed to fetch user documents from Firestore:', err);
      // Fallback cache
      const local = localStorage.getItem(`draft_docs_${userId}`);
      return local ? JSON.parse(local) : [];
    }
  },

  // Save or update document
  async saveDocument(userId: string, document: DocumentData): Promise<boolean> {
    if (!userId || !document.id) return false;

    // Cache locally as immediate offline backup
    try {
      localStorage.setItem(`draft_doc_${document.id}`, JSON.stringify(document));
    } catch (e) {}

    if (!isFirebaseConfigured || !db) return true;

    try {
      const docRef = doc(db, 'documents', document.id);
      await setDoc(
        docRef,
        {
          ownerId: userId,
          title: document.title || 'وثيقة تربوية',
          type: document.documentType || 'fiche_pedagogique',
          content: document,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.error('Failed to save document to Firestore:', err);
      return false;
    }
  },

  // Delete document
  async deleteDocument(userId: string, documentId: string): Promise<boolean> {
    try {
      localStorage.removeItem(`draft_doc_${documentId}`);
    } catch (e) {}

    if (!isFirebaseConfigured || !db || !documentId) return true;

    try {
      const docRef = doc(db, 'documents', documentId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error('Failed to delete document from Firestore:', err);
      return false;
    }
  },

  // Fetch single document by ID
  async getDocumentById(documentId: string): Promise<DocumentData | null> {
    if (!documentId) return null;

    if (!isFirebaseConfigured || !db) {
      const local = localStorage.getItem(`draft_doc_${documentId}`);
      return local ? JSON.parse(local) : null;
    }

    try {
      const docRef = doc(db, 'documents', documentId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        return {
          ...data.content,
          id: snapshot.id,
        };
      }
      return null;
    } catch (err) {
      console.error('Error fetching document:', err);
      const local = localStorage.getItem(`draft_doc_${documentId}`);
      return local ? JSON.parse(local) : null;
    }
  },
};
