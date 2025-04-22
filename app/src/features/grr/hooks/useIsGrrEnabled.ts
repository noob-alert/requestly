import { useSelector } from "react-redux";
import { getUserAuthDetails } from "store/slices/global/user/selectors";

export const useIsGrrEnabled = () => {
  const user = useSelector(getUserAuthDetails);
  const isGrrEnabled = !!user?.details?.profile?.blockConfig?.grr?.isBlocked;

  return { isGrrEnabled };
};
