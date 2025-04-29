import { useCallback, useEffect } from "react";
import firebaseApp from "firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initIntegrations } from "modules/analytics";
import { useDispatch } from "react-redux";
import { getEmailType } from "utils/mailCheckerUtils";
import { getUser } from "backend/user/getUser";

const ThirdPartyIntegrationsHandler = () => {
  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, [dispatch]);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const emailType = await getEmailType(user.email);
        const userDetails = await getUser(user.uid);
        const browserstackId = userDetails?.browserstackId ?? "";
        initIntegrations({ ...user, emailType, browserstackId }, stableDispatch);
      } else {
        initIntegrations(user, stableDispatch);
      }
    });
  }, [stableDispatch]);
};

export default ThirdPartyIntegrationsHandler;
