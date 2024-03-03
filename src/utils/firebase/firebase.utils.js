import { initializeApp } from 'firebase/app';
import {
	getAuth,
	//signInWithRedirect,
	signInWithPopup,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged
} from 'firebase/auth';

import {
	getFirestore,
	doc,
	query,
	where,
	getDoc,
	setDoc,//completely overwrite a document with new data
	addDoc,
	updateDoc, //update specific fields of a document without overwriting the entire document
	increment,
	collection, 
	getDocs,
	deleteDoc
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDAaNGtNG_53S0p9vGjJK4_Ttqb111o1jQ",
  authDomain: "news-blog-db.firebaseapp.com",
  projectId: "news-blog-db",
  storageBucket: "news-blog-db.appspot.com",
  messagingSenderId: "578427641459",
  appId: "1:578427641459:web:8f1368315785cc00615406"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
	prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const db = getFirestore(firebaseApp);

export const createUserDocumentFromAuth = async (
	userAuth, 
	additionalInformation = {}
	) => {
	if(!userAuth) return;
	
	const userDocRef = doc(db, 'users', userAuth.uid);	
	const userSnapshot = await getDoc(userDocRef);
	
	if(!userSnapshot.exists()){
		const { displayName, email } = userAuth;		
		const createdAt = new Date();
		
		try{
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
				...additionalInformation,
			});
		} catch (error) {
			console.log('error creating the user', error.message);
		}
	}
	return userSnapshot;
}

export const createAuthUserWithEmailAndPassword = async (email, password, additionalInformation) => {
	if(!email || !password) return;
	
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  user.displayName = additionalInformation.displayName
  createUserDocumentFromAuth(user, additionalInformation);
  
  return user;
 
}

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
	if(!email || !password) return;

	return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => 
	onAuthStateChanged(auth, callback)

export const fetchUser = async (userId) => {
	try {
        //Reference to the specific user document
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
       
        const user = userDoc.data(); // Access the document data
 			  return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error; // Re-throw the error to handle it in the calling code
    }
}

export const createPostDocument = async (
	newPostData, 
	additionalInformation = {}
	) => {
	try {	
		const postsCollectionRef = collection(db, 'posts');
		const postDocRef = await addDoc(postsCollectionRef, newPostData); 
		const postDoc = await getDoc(postDocRef); 
		const post = {
			  id: postDoc.id,
			  ...postDoc.data()
		};
    return post;
	} catch (error) {
		console.error('Error adding post:', error);
	} 	
}

export const editPostDocument = async (post) => {
	try {

		const postDocRef = doc(db, 'posts', post.id);
		await updateDoc(postDocRef, post); 

		return post;
	} catch (error) {    
		console.error('Error adding post:', error);
	}	
}

export const fetchPosts = async () => {

	try {
    const postsCollectionRef = collection(db, 'posts'); // Reference to the 'posts' collection
     
    const querySnapshot = await getDocs(postsCollectionRef); // Fetch all documents in the collection
 
    const postData = querySnapshot.docs.map((doc) => ({    	
      id: doc.id, // Document ID
      ...doc.data(), // Document data
    }));
    // Sort postData by createdAt field in descending order
    postData.sort((a, b) => b.createdAt - a.createdAt);
    return postData;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export const fetchPost = async (postId) => {			
	try {
        //Reference to the specific post document
        const postDocRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postDocRef);
        
        const post = postDoc.data(); // Access the document data
 
        return post;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error; // Re-throw the error to handle it in the calling code
    }
}

export const deletePost = async (postId) => {
	try {
		// Delete comments related to the post
    const commentsQuerySnapshot = await getDocs(query(collection(db, 'postComments'), where('postId', '==', postId)));
    commentsQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    // Delete likes related to the post
    const likesQuerySnapshot = await getDocs(query(collection(db, 'postLikes'), where('postId', '==', postId)));
    likesQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });      // Delete post from Firestore database
    
    await deleteDoc(doc(db, 'posts', postId));
		
    } catch (error) {
      console.error('Error deleting post:', error);
    }	
}

export const fetchIfPostLiked = async (fields) => {
	try {

      const postLikesCollectionRef = collection(db, 'postLikes');
      const postLikeQuery = query(
          postLikesCollectionRef,
          where('postId', '==', fields.postId),
          where('userId', '==', fields.userId)
      );
      const querySnapshot = await getDocs(postLikeQuery);
      
      // Check if any documents exist in the query results
      return !querySnapshot.empty;
  } catch (error) {
      console.error('Error fetching post likes:', error);
      throw error;
  }
}

const postLikes = async (fields, liked) => {
	try {
		const postLikesCollectionRef = collection(db, 'postLikes');	
		if (!liked) {
				await addDoc(postLikesCollectionRef, fields);	
		}	else {
				const postLikeQuery = query(postLikesCollectionRef, where('postId', '==', fields.postId), where('userId', '==', fields.userId));
				const postLikeDocs = await getDocs(postLikeQuery);
     			postLikeDocs.forEach(doc => {
        	deleteDoc(doc.ref);
      	});     
		}	
	} catch (error) {
		console.log('Error at postLikes');
		throw error; 
	}	 	
}

export const sumLike = async (postId, liked, fields) => {
    try {
        // Reference to the specific post document
        const postDocRef = doc(db, 'posts', postId);

        // Construct the update object based on the liked variable
				const updateObject = liked ? { likes: increment(-1) } : { likes: increment(1) };

				// Update the document with the new like count
				await updateDoc(postDocRef, updateObject);        
       	
       	postLikes(fields, liked)//Acumulate the users likes per post
        
    } catch (error) {
        console.error('Error updating likes:', error);
        throw error; // Re-throw the error to handle it in the calling code
    }
};

export const saveComment = async (fields) => {
	try {
		
		 const commentDocRef = collection(db, 'postComments');
		 const newPostCommentRef = await addDoc(commentDocRef, fields);
		 return newPostCommentRef;
	}	catch (error) {
        console.error('Error saving comment:', error);
        throw error; // Re-throw the error to handle it in the calling code
    }
}

export const fetchComments = async (postId) => {

	try {
    const commentsCollectionRef = collection(db, 'postComments');
    const postCommentsQuery = query(commentsCollectionRef, 
    			where('postId', '==', postId),); // Reference to a specific document within the collection
      	
    const querySnapshot = await getDocs(postCommentsQuery); // Fetch all comments documents for the specified post ID
  	  
    const commentData = querySnapshot.docs.map((doc) => ({    	
      id: doc.id, // Document ID
      ...doc.data(), // Document data
    }));

    // Sort commentData by createdAt field in descending order
    commentData.sort((a, b) => b.createdAt - a.createdAt);
    return commentData;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export const getPostCommentsQuantity = async (postId) => {
  try {
    // Reference to the comments collection for the specific post
    const commentsCollectionRef = collection(db, 'postComments');
    const postCommentsQuery = query(commentsCollectionRef, where('postId', '==', postId));

    // Fetch all comments documents for the specified post ID
    const querySnapshot = await getDocs(postCommentsQuery);
   
    // Return the number of comments
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting post comments quantity:', error);
    throw error; // Re-throw the error to handle it in the calling code
  }
};

export const deletePostComment = async (commentId) => {
		try {			
      // Delete comment from Firestore database     
      await deleteDoc(doc(db, 'postComments', commentId));

    } catch (error) {
      console.error('Error deleting comment:', error);
    }	
}

