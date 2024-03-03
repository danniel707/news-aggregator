import { createContext, useState, useEffect } from 'react';

import { onAuthStateChangedListener } from '../utils/firebase/firebase.utils'
import { fetchUser } from '../utils/firebase/firebase.utils'

export const UserContext = createContext({
	currentUser: null,
	setCurrentUser: () => null,
});

export const UserProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);	
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const unsuscribe = onAuthStateChangedListener((user) => {
			// if(user) {
			// 	console.log('3', user)
			// 	createUserDocumentFromAuth(user);
			// 	console.log('7')
			// }
			
			setCurrentUser(user)
		})
		return unsuscribe
	}, []);

	useEffect(() => {
	    const fetchUserData = async () => {
	      try {
	        const fetchedUser = currentUser ? await fetchUser(currentUser.uid) : null;
	        setUserData(fetchedUser);
	      } catch (error) {
	        console.error(error);
	      }
	    }
	    fetchUserData();
	}, [currentUser]);

	const value = { 
		currentUser, 
		setCurrentUser, 
		userData,
		setUserData
	};
	
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
