// ================= IMPORTS =================
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyBnLUHidIafVYqJ4nwPGn_uK5lLriGokwE",
  authDomain: "react-quick-food.firebaseapp.com",
  projectId: "react-quick-food",
  storageBucket: "react-quick-food.appspot.com",
  messagingSenderId: "775496944172",
  appId: "1:775496944172:web:c57dc1dbd0aa26dd",
};

// ================= INIT FIREBASE =================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ================= SIGN UP =================
async function signUp(userDetails) {
  try {
    const {
      userName,
      userEmail,
      userPassword,
      userCity,
      userCountry,
      userGender,
      userAge,
      userProfileImage,
      isRestaurant,
      typeOfFood,
      propsHistory,
    } = userDetails;

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userEmail,
      userPassword
    );

    const uid = userCredential.user.uid;

    // Upload profile image
    const imageRef = ref(
      storage,
      `userProfileImage/${uid}/${userProfileImage.name}`
    );
    await uploadBytes(imageRef, userProfileImage);
    const imageUrl = await getDownloadURL(imageRef);

    const userData = {
      userName,
      userEmail,
      userCity,
      userCountry,
      userGender,
      userAge,
      userUid: uid,
      isRestaurant,
      userProfileImageUrl: imageUrl,
      typeOfFood,
    };

    await setDoc(doc(db, "users", uid), userData);

    propsHistory.push(isRestaurant ? "/order-requests" : "/");
    return userData;
  } catch (error) {
    throw error.message;
  }
}

// ================= LOGIN =================
async function logIn(userLoginDetails) {
  try {
    const { userLoginEmail, userLoginPassword, propsHistory } =
      userLoginDetails;

    const userCredential = await signInWithEmailAndPassword(
      auth,
      userLoginEmail,
      userLoginPassword
    );

    const snap = await getDoc(doc(db, "users", userCredential.user.uid));

    propsHistory.push(snap.data().isRestaurant ? "/order-requests" : "/");
    return userCredential;
  } catch (error) {
    throw error.message;
  }
}

// ================= ADD ITEM =================
async function addItem(itemDetails) {
  try {
    const {
      itemTitle,
      itemIngredients,
      itemPrice,
      itemImage,
      chooseItemType,
    } = itemDetails;

    const uid = auth.currentUser.uid;

    const imageRef = ref(storage, `itemImage/${uid}/${itemImage.name}`);
    await uploadBytes(imageRef, itemImage);
    const imageUrl = await getDownloadURL(imageRef);

    await addDoc(collection(db, "users", uid, "menuItems"), {
      itemTitle,
      itemIngredients,
      itemPrice,
      itemImageUrl: imageUrl,
      chooseItemType,
    });

    return "Successfully added food item";
  } catch (error) {
    throw error.message;
  }
}

// ================= ORDER NOW =================
async function orderNow(cartItemsList, totalPrice, resDetails, userDetails) {
  try {
    const uid = auth.currentUser.uid;

    const myOrder = {
      itemsList: cartItemsList,
      totalPrice,
      status: "PENDING",
      ...resDetails,
    };

    const orderRequest = {
      itemsList: cartItemsList,
      totalPrice,
      status: "PENDING",
      ...userDetails,
    };

    await addDoc(collection(db, "users", uid, "myOrder"), myOrder);

    await addDoc(
      collection(db, "users", resDetails.id, "orderRequest"),
      orderRequest
    );

    return "Successfully ordered";
  } catch (error) {
    throw error.message;
  }
}

// ================= EXPORTS =================
export { auth, db, signUp, logIn, addItem, orderNow };
export default app;
