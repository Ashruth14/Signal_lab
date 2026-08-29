import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  query,
  orderBy,
  Unsubscribe,
  DocumentData,
} from 'firebase/firestore';
import { db, isFirebaseConfigured, initFirebase } from './firebase';
import {
  DevTask,
  ProductRequirement,
  FeedbackItem,
  ProjectDecision,
  SecondBrainNote,
  SecurityFinding,
  QATestCase,
  BugItem,
  ContextBlock,
  ProjectWorkspace,
} from '../types';

export const firestoreService = {
  isAvailable(): boolean {
    return isFirebaseConfigured();
  },

  // Realtime subscription helper
  subscribeToWorkspaceCollection<T extends { id: string }>(
    workspaceId: string,
    collectionName: string,
    onData: (items: T[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    if (!this.isAvailable()) {
      return () => {};
    }

    const { db: activeDb } = initFirebase();
    if (!activeDb) return () => {};

    try {
      const colRef = collection(activeDb, 'workspaces', workspaceId, collectionName);
      return onSnapshot(
        colRef,
        (snapshot) => {
          const items: T[] = [];
          snapshot.forEach((d) => {
            items.push({ id: d.id, ...(d.data() as any) });
          });
          onData(items);
        },
        (error) => {
          console.warn(`Firestore subscription error on ${collectionName}:`, error);
          if (onError) onError(error);
        }
      );
    } catch (e) {
      console.warn(`Failed to attach listener for ${collectionName}:`, e);
      return () => {};
    }
  },

  async saveDocument<T extends { id: string }>(
    workspaceId: string,
    collectionName: string,
    item: T
  ): Promise<void> {
    if (!this.isAvailable()) return;
    const { db: activeDb } = initFirebase();
    if (!activeDb) return;

    try {
      const docRef = doc(activeDb, 'workspaces', workspaceId, collectionName, item.id);
      await setDoc(docRef, { ...item, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.error(`Firestore save error on ${collectionName}/${item.id}:`, e);
    }
  },

  async updateDocument(
    workspaceId: string,
    collectionName: string,
    docId: string,
    updates: Partial<DocumentData>
  ): Promise<void> {
    if (!this.isAvailable()) return;
    const { db: activeDb } = initFirebase();
    if (!activeDb) return;

    try {
      const docRef = doc(activeDb, 'workspaces', workspaceId, collectionName, docId);
      await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
    } catch (e) {
      console.error(`Firestore update error on ${collectionName}/${docId}:`, e);
    }
  },

  async deleteDocument(
    workspaceId: string,
    collectionName: string,
    docId: string
  ): Promise<void> {
    if (!this.isAvailable()) return;
    const { db: activeDb } = initFirebase();
    if (!activeDb) return;

    try {
      const docRef = doc(activeDb, 'workspaces', workspaceId, collectionName, docId);
      await deleteDoc(docRef);
    } catch (e) {
      console.error(`Firestore delete error on ${collectionName}/${docId}:`, e);
    }
  },

  async saveWorkspaceMeta(workspace: ProjectWorkspace): Promise<void> {
    if (!this.isAvailable()) return;
    const { db: activeDb } = initFirebase();
    if (!activeDb) return;

    try {
      const docRef = doc(activeDb, 'workspaces', workspace.id);
      await setDoc(docRef, { ...workspace, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.error(`Firestore workspace meta save error:`, e);
    }
  },

  // Bulk sync workspace data to Firestore
  async seedWorkspaceData(
    workspaceId: string,
    data: {
      workspaceMeta?: ProjectWorkspace;
      devTasks?: DevTask[];
      prds?: ProductRequirement[];
      feedback?: FeedbackItem[];
      decisions?: ProjectDecision[];
      notes?: SecondBrainNote[];
      securityFindings?: SecurityFinding[];
      qaTestCases?: QATestCase[];
      bugs?: BugItem[];
      contextBlocks?: ContextBlock[];
    }
  ): Promise<{ success: boolean; seededCount: number; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, seededCount: 0, error: 'Firebase is not configured yet.' };
    }

    const { db: activeDb } = initFirebase();
    if (!activeDb) {
      return { success: false, seededCount: 0, error: 'Firestore is not initialized.' };
    }

    try {
      let count = 0;
      const batch = writeBatch(activeDb);

      if (data.workspaceMeta) {
        const wsRef = doc(activeDb, 'workspaces', workspaceId);
        batch.set(wsRef, { ...data.workspaceMeta, seededAt: new Date().toISOString() }, { merge: true });
        count++;
      }

      const collectionsToSeed = [
        { name: 'devTasks', items: data.devTasks },
        { name: 'prds', items: data.prds },
        { name: 'feedback', items: data.feedback },
        { name: 'decisions', items: data.decisions },
        { name: 'notes', items: data.notes },
        { name: 'securityFindings', items: data.securityFindings },
        { name: 'qaTestCases', items: data.qaTestCases },
        { name: 'bugs', items: data.bugs },
        { name: 'contextBlocks', items: data.contextBlocks },
      ];

      for (const col of collectionsToSeed) {
        if (col.items && col.items.length > 0) {
          for (const item of col.items) {
            const docRef = doc(activeDb, 'workspaces', workspaceId, col.name, (item as any).id);
            batch.set(docRef, { ...item, seededAt: new Date().toISOString() }, { merge: true });
            count++;
          }
        }
      }

      await batch.commit();
      return { success: true, seededCount: count };
    } catch (e: any) {
      console.error('Firestore seeding failed:', e);
      return { success: false, seededCount: 0, error: e.message || 'Seeding failed' };
    }
  },

  // Ping health check to verify write/read permissions
  async testConnection(): Promise<{ ok: boolean; message: string }> {
    if (!this.isAvailable()) {
      return { ok: false, message: 'Firebase configuration missing or incomplete.' };
    }

    const { db: activeDb } = initFirebase();
    if (!activeDb) {
      return { ok: false, message: 'Firestore initialization failed.' };
    }

    try {
      const testDocRef = doc(activeDb, '_diagnostics', 'health_check');
      await setDoc(testDocRef, {
        ping: 'pong',
        timestamp: new Date().toISOString(),
        client: 'Dev Atlas v2.0',
      });
      return { ok: true, message: 'Connected to Cloud Firestore successfully!' };
    } catch (e: any) {
      return { ok: false, message: `Firestore access error: ${e.message}` };
    }
  },
};
