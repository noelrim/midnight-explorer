import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';

export async function fetchRecentBlocks(limitCount = 10) {
  const q = query(collection(db, 'RecentBlocks'), orderBy('Timestamp', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchRecentTransactions(limitCount = 10) {
  const q = query(collection(db, 'RecentTransactions'), orderBy('Timestamp', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchSPOs() {
  const snapshot = await getDocs(collection(db, 'SPOs'));
  return snapshot.docs.map(doc => doc.data());
}

export async function fetchHourlyTransactions(sinceKey) {
  const q = query(collection(db, 'HourlyTransactions'), where('__name__', '>=', sinceKey), orderBy('__name__'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
