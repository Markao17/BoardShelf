import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { getAnalytics } from 'firebase/analytics';

const app = initializeApp(environment.firebase);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
