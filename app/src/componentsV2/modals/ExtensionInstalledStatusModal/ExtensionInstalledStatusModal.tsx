import { Button, Modal } from "antd";
import { useSelector } from "react-redux";
import { getAppMode } from "store/selectors";
import { MdCheckCircleOutline } from "@react-icons/all-files/md/MdCheckCircleOutline";
import { MdWarningAmber } from "@react-icons/all-files/md/MdWarningAmber";
import { IoMdArrowForward } from "@react-icons/all-files/io/IoMdArrowForward";
import { isExtensionInstalled } from "actions/ExtensionActions";
import LINKS from "config/constants/sub/links";
import { CONSTANTS as GLOBAL_CONSTANTS } from "@requestly/requestly-core";
import "./extensionInstalledStatusModal.scss";
// import PageLoader from "components/misc/PageLoader";

export const ExtensionInstalledStatusModal = () => {
  const appMode = useSelector(getAppMode);

  const handleButtonClick = () => {
    if (isExtensionInstalled()) {
      // TODO: close modal
    } else {
      // TODO: redirect to correct chrome store
    }
  };

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
      //TODO: add state here to open modal
      open={true}
      footer={null}
      closable={false}
      className="extension-installed-status-modal"
      wrapClassName="extension-installed-status-modal-wrapper"
    >
      {/* <PageLoader/> */}
      <div className="extension-installed-status-content">
        <img src="/assets/media/common/rq_logo_full.svg" alt="Requestly by Browserstack" />
        <div className="extension-installed-status-content-body">
          <div className="extension-installed-status-content-body-header">{extensionInstalledStatusHeader}</div>
          <div className="extension-installed-status-content-body-description">
            {isExtensionInstalled()
              ? " Intercept, modify, and mock HTTPS traffic, and test APIs with a powerful client. Instantly mock API responses without any backend dependencies."
              : "To get started, please install the extension and refresh this page."}
          </div>
          <Button type="primary" className="extension-installed-status-content-body-button" onClick={handleButtonClick}>
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
    </Modal>
  );
};
