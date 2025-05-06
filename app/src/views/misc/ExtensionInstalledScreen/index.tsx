import { Button, Modal } from "antd";
import { MdCheckCircleOutline } from "@react-icons/all-files/md/MdCheckCircleOutline";
import { MdWarningAmber } from "@react-icons/all-files/md/MdWarningAmber";
import { isExtensionInstalled } from "actions/ExtensionActions";
import LINKS from "config/constants/sub/links";
import "./extensionInstalledScreen.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLoader from "components/misc/PageLoader";
import PATHS from "config/constants/sub/paths";
import { redirectToHome, redirectToStart } from "utils/RedirectionUtils";
import { initIntegrations } from "./minimalIntegrations";

/* TEMPORARY COMPONENT, SHOULD BE REMOVED AFTER NEXT EXTENSION RELEASE */
const ExtensionInstalledScreen = () => {
  useEffect(() => {
    initIntegrations();
  }, []);

  const navigate = useNavigate();

  const [isIntegrationDone, setIsIntegrationDone] = useState(false);
  const [isBstackUser, setIsBstackUser] = useState(false);

  const { pathname } = useLocation();
  const shouldShowModal = useMemo(() => {
    return pathname.includes(PATHS._INSTALLED_EXTENSION.RELATIVE);
  }, [pathname]);

  useEffect(() => {
    if (!isIntegrationDone) {
      const pageURL = new URL(window.location.href);
      const params = new URLSearchParams(pageURL.search);
      if (pageURL.pathname.includes(PATHS._INSTALLED_EXTENSION.RELATIVE) && params.has("isBstack")) {
        setIsBstackUser(true);
        params.delete("isBstack");
        const newSearch = params.toString();
        navigate({ search: newSearch ? `?${newSearch}` : "" }, { replace: true });
      }
      setIsIntegrationDone(true);
    }
  }, [isIntegrationDone, navigate]);

  /* backup useEffect to take user to app if integration does not complete */
  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    if (!isIntegrationDone) {
      id = setTimeout(() => {
        redirectToHome("EXTENSION", navigate);
      }, 7_000);
    }

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [isIntegrationDone, navigate]);

  const handleButtonClick = useCallback(() => {
    if (isBstackUser) {
      redirectToStart(navigate);
    } else {
      redirectToHome("EXTENSION", navigate);
    }
  }, [isBstackUser, navigate]);

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

  return (
    <Modal // to quickly have a "full screen"
      zIndex={2000} // to make sure it is on the top of all other modals thrown by the app
      open={shouldShowModal}
      footer={null}
      closable={false}
      className="extension-installed-status-modal"
      wrapClassName="extension-installed-status-modal-wrapper"
    >
      {isIntegrationDone ? (
        <>
          <div className="extension-installed-status-content">
            <img src="/assets/media/common/RQ-BStack Logo.svg" alt="Requestly by Browserstack" />
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
