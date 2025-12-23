import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyBPRKDk8GgAB1uP2E96YJknP6IRjOw8Y9k',
	authDomain: 'todosproject-e00c1.firebaseapp.com',
	projectId: 'todosproject-e00c1',
	storageBucket: 'todosproject-e00c1.firebasestorage.app',
	messagingSenderId: '597955793326',
	appId: '1:597955793326:web:1bf2ff6e80a4943467783f',
	databaseURL:
		'https://todosproject-e00c1-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
