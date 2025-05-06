import { Button, Modal } from "antd";
import { useSelector } from "react-redux";
import { getAppMode } from "store/selectors";
import { MdCheckCircleOutline } from "@react-icons/all-files/md/MdCheckCircleOutline";
import { MdWarningAmber } from "@react-icons/all-files/md/MdWarningAmber";
import { isExtensionInstalled } from "actions/ExtensionActions";
import LINKS from "config/constants/sub/links";
import { CONSTANTS as GLOBAL_CONSTANTS } from "@requestly/requestly-core";
import "./extensionInstalledScreen.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLoader from "components/misc/PageLoader";
import PATHS from "config/constants/sub/paths";
import { redirectToHome, redirectToStart } from "utils/RedirectionUtils";

/* TEMPORARY COMPONENT, SHOULD BE REMOVED AFTER NEXT EXTENSION RELEASE */
const ExtensionInstalledScreen = () => {
  const navigate = useNavigate();

  /* can't use growthbook flag here, since this component sits above growthbook integration */
  const isNewLogo = false; // will need to redeploy when we want to change the logo
  const [isIntegrationDone, setIsIntegrationDone] = useState(false);
  const [isBstackUser, setIsBstackUser] = useState(false);

  const appMode = useSelector(getAppMode);

  const { pathname } = useLocation();
  const shouldShowModal = useMemo(() => {
    return pathname.includes(PATHS._INSTALLED_EXTENSION.RELATIVE);
  }, [pathname]);

  const logoPath = `/assets/media/common/${isNewLogo ? "RQ-BStack Logo.svg" : "rq_logo_full.svg"}`;
  useEffect(() => {
    if (!isIntegrationDone) {
      // relies on this event being dispatched from integrations module
      document.addEventListener("integrations-done", () => {
        const pageURL = new URL(window.location.href);
        const params = new URLSearchParams(pageURL.search);
        if (pageURL.pathname.includes(PATHS._INSTALLED_EXTENSION.RELATIVE) && params.has("isBstack")) {
          setIsBstackUser(true);
          params.delete("isBstack");
          const newSearch = params.toString();
          navigate({ search: newSearch ? `?${newSearch}` : "" }, { replace: true });
        }
        setIsIntegrationDone(true);
      });
    }
  }, [isIntegrationDone, navigate]);

  /* backup useEffect to take user to app if integration does not complete */
  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    if (!isIntegrationDone) {
      id = setTimeout(() => {
        redirectToHome(appMode, navigate);
      }, 7_000);
    }

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [isIntegrationDone, appMode, navigate]);

  useEffect(() => {
    // automatic redirect if not bsstack user
    if (isIntegrationDone && !isBstackUser) {
      redirectToHome(appMode, navigate);
    }
  }, [isBstackUser, isIntegrationDone, appMode, navigate]);

  const handleButtonClick = useCallback(() => {
    console.log("DBG: 1");
    if (isBstackUser) {
      console.log("DBG: 2");
      redirectToStart(navigate);
    } else {
      console.log("DBG: 3");
      redirectToHome(appMode, navigate);
    }
  }, [isBstackUser, appMode, navigate]);

  const extensionInstalledStatusHeader = isExtensionInstalled() ? (
    <>
      <MdCheckCircleOutline className="success" />
      The extension has been successfully installed!
    </>
  ) : (
    <>
      <MdWarningAmber className="warning" />
      Requestly extension is not installed
    </>
  );

  if (appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP) {
    return null;
  }

  return (
    <Modal
      zIndex={2000} // to make sure it is on the top of all other modals thrown by the app
      open={shouldShowModal}
      footer={null}
      closable={false}
      className="extension-installed-status-modal"
      wrapClassName="extension-installed-status-modal-wrapper"
    >
      {isIntegrationDone && isBstackUser ? (
        <>
          <div className="extension-installed-status-content">
            <img src={logoPath} alt="Requestly by Browserstack" />
            <div className="extension-installed-status-content-body">
              <div className="extension-installed-status-content-body-header">{extensionInstalledStatusHeader}</div>
              <div className="extension-installed-status-content-body-description">
                {isExtensionInstalled()
                  ? "You're all set to intercept, record, and mock network traffic — let’s get started."
                  : "To get started, please install the extension and refresh this page."}
              </div>
              <Button
                type="primary"
                className="extension-installed-status-content-body-button"
                onClick={handleButtonClick}
              >
                {isExtensionInstalled() ? "Continue to app" : "Install extension"}
              </Button>
            </div>
          </div>
          <div className="extension-installed-status-content-footer">
            By continuing to use Requestly, you acknowledge that you have read and agree to our{" "}
            <a href={LINKS.REQUESTLY_TERMS_AND_CONDITIONS} target="_blank" rel="noreferrer">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href={LINKS.REQUESTLY_PRIVACY_POLICY} target="_blank" rel="noreferrer">
              Privacy Policy
            </a>
          </div>
        </>
      ) : (
        <PageLoader />
      )}
    </Modal>
  );
};

export default ExtensionInstalledScreen;
