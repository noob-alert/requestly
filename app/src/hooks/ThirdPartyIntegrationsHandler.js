import { useCallback, useEffect, useState } from "react";
import firebaseApp from "firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initEDSIntegration, initIntegrations } from "modules/analytics";
import { useDispatch, useSelector } from "react-redux";
import { getEmailType } from "utils/mailCheckerUtils";
import { getUser } from "backend/user/getUser";
import { getUserAttributes } from "store/selectors";
import { getAvailableBillingTeams } from "store/features/billing/selectors";
import { getUserAuthDetails } from "store/slices/global/user/selectors";

const ThirdPartyIntegrationsHandler = () => {
  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, [dispatch]);

  const userAttributes = useSelector(getUserAttributes);
  const billingTeams = useSelector(getAvailableBillingTeams);
  const user = useSelector(getUserAuthDetails);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const emailType = await getEmailType(user.email);
        const userDetails = await getUser(user.uid);
        const browserstackId = userDetails?.browserstackId ?? "";
        setUserDetails({ ...user, emailType, browserstackId });
        initIntegrations({ ...user, emailType, browserstackId }, stableDispatch);
      } else {
        setUserDetails(null);
        initIntegrations(user, stableDispatch);
      }
    });
  }, [stableDispatch]);

  useEffect(() => {
    if (userDetails) {
      const billingDetails = {
        billing_id: billingTeams.map((team) => team.id),
        plan_name: user?.details?.planDetails?.planName,
        status: user?.details?.planDetails?.status,
      };
      initEDSIntegration(userDetails, userAttributes, billingDetails);
    }
  }, [
    billingTeams,
    user?.details?.planDetails?.planName,
    user?.details?.planDetails?.status,
    userAttributes,
    userDetails,
  ]);
};

export default ThirdPartyIntegrationsHandler;
