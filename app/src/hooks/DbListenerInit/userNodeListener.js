import { onValue } from "firebase/database";
import Logger from "lib/logger";
import { getNodeRef } from "../../actions/FirebaseActions";
import { globalActions } from "store/slices/global/slice";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import firebaseApp from "firebase";

const updateUserProfileInRedux = (dispatch) => {
  if (userDetails) {
    dispatch(
      globalActions.updateUserProfile({
        userProfile: profile
          ? {
              ...(userDetails ?? {}),
              displayName: profile.displayName,
              isEmailVerified: profile.isVerified || userDetails.isEmailVerified,
              blockConfig: profile["block-config"],
            }
          : userDetails,
      })
    );

    // set isSyncEnabled in window so that it can be used in storageService
    window.isSyncEnabled = userDetails.isSyncEnabled || null;
  }
};

// TODO: FIx the listeners here
let profile = null;
let userDetails = null;
const userNodeListener = (dispatch, uid) => {
  if (uid) {
    try {
      const db = getFirestore(firebaseApp);

      onSnapshot(doc(db, "users", uid), (doc) => {
        if (doc.exists()) {
          profile = doc.data();
          updateUserProfileInRedux(dispatch);
        }
      });

      const userNodeRef = getNodeRef(["users", uid, "profile"]);
      onValue(userNodeRef, async (snapshot) => {
        userDetails = snapshot.val();
        updateUserProfileInRedux(dispatch);
      });
    } catch (e) {
      Logger.log(e);
    }
  }
};

export default userNodeListener;
