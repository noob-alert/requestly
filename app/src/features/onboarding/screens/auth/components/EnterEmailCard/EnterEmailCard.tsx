import React, { useState } from "react";
import { RQButton } from "lib/design-system-v2/components";
import { AuthFormInput } from "../RQAuthCard/components/AuthFormInput/AuthFormInput";
import { getFunctions, httpsCallable } from "firebase/functions";
import { toast } from "utils/Toast";
import { AuthSyncMetadata } from "../../types";
import { AuthProvider } from "../../types";
import { getSSOProviderId } from "backend/auth/sso";
import { isEmailValid } from "utils/FormattingHelper";

interface EnterEmailCardProps {
  email: string;
  onEmailChange: (email: string) => void;
  onAuthSyncVerification: (metadata: any) => void;
  setSSOProviderId: (providerId: string) => void;
}

export const EnterEmailCard: React.FC<EnterEmailCardProps> = ({
  email,
  onEmailChange,
  onAuthSyncVerification,
  setSSOProviderId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOnContinue = async () => {
    setIsLoading(true);

    const processedEmail = email.trim();

    if (!isEmailValid(processedEmail)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    const getUserAuthSyncDetails = httpsCallable(getFunctions(), "users-getAuthSyncData");
    try {
      const ssoProviderId = await getSSOProviderId(processedEmail);
      getUserAuthSyncDetails({ email }).then(({ data }: { data: AuthSyncMetadata }) => {
        if (data.success) {
          const metadata = data.syncData;
          if (ssoProviderId) {
            metadata.providers = [...(metadata.providers || []), AuthProvider.SSO];
            setSSOProviderId(ssoProviderId);
          }
          onAuthSyncVerification(metadata);
          if (!metadata.isSyncedUser) {
            setIsLoading(false);
          }
          return;
        }
        toast.error("Something went wrong! Please try again or contact support.");
        setIsLoading(false);
      });
    } catch (error) {
      toast.error("Something went wrong! Please try again or contact support.");
      setIsLoading(false);
    }
  };

  return (
    <div className="enter-email-card">
      <div className="onboarding-card-title">Sign in to your account</div>
      <div style={{ marginTop: "16px" }}>
        <AuthFormInput
          placeholder="example@work.com"
          label="Your work email"
          autoFocus
          value={email}
          onValueChange={onEmailChange}
          onPressEnter={handleOnContinue}
        />
      </div>
      <RQButton
        loading={isLoading}
        disabled={!email}
        size="large"
        type="primary"
        block
        style={{ marginTop: "16px" }}
        onClick={handleOnContinue}
      >
        Continue
      </RQButton>
    </div>
  );
};
