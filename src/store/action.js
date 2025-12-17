import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";

// ================= UPDATE USER =================
const update_user = () => {
  return (dispatch) => {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        dispatch({
          type: "SET_USER",
          user: { ...snap.data(), isLogin: true },
        });
      }
    });
  };
};

// ================= REMOVE USER =================
const remove_user = () => {
  return async (dispatch) => {
    try {
      const auth = getAuth();
      await signOut(auth);
      dispatch({
        type: "REMOVE_USER",
        user: { isLogin: false },
      });
    } catch (error) {
      console.log("Logout Error:", error.message);
    }
  };
};

// ================= RESTAURANT LIST =================
const restaurant_list = () => {
  return (dispatch) => {
    onSnapshot(collection(db, "users"), (snapshot) => {
      const restaurantList = [];
      snapshot.forEach((docSnap) => {
        if (docSnap.data().isRestaurant) {
          restaurantList.push({ id: docSnap.id, ...docSnap.data() });
        }
      });

      dispatch({
        type: "RESTAURANT_LIST",
        restaurantList,
      });
    });
  };
};

// ================= ORDER REQUEST =================
const order_request = () => {
  return (dispatch) => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        onSnapshot(
          collection(db, "users", user.uid, "orderRequest"),
          (snapshot) => {
            const orderRequest = [];
            snapshot.forEach((docSnap) => {
              orderRequest.push({ id: docSnap.id, ...docSnap.data() });
            });

            dispatch({
              type: "ORDER_REQUEST",
              orderRequest,
            });
          }
        );
      }
    });
  };
};

// ================= MY ORDER =================
const my_order = () => {
  return (dispatch) => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        onSnapshot(
          collection(db, "users", user.uid, "myOrder"),
          (snapshot) => {
            const myOrder = [];
            snapshot.forEach((docSnap) => {
              myOrder.push({ id: docSnap.id, ...docSnap.data() });
            });

            dispatch({
              type: "MY_ORDER",
              myOrder,
            });
          }
        );
      }
    });
  };
};

// ================= MY FOODS =================
const my_foods = () => {
  return (dispatch) => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        onSnapshot(
          collection(db, "users", user.uid, "menuItems"),
          (snapshot) => {
            const myFoods = [];
            snapshot.forEach((docSnap) => {
              myFoods.push({ id: docSnap.id, ...docSnap.data() });
            });

            dispatch({
              type: "MY_FOODS",
              myFoods,
            });
          }
        );
      }
    });
  };
};

export {
  update_user,
  remove_user,
  restaurant_list,
  order_request,
  my_order,
  my_foods,
};
