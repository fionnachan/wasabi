import debounce from "lodash/debounce";
import { useCallback, useEffect, useRef } from "react";

export const useDebounce = (
  callbackFn: (...args: any) => void,
  delay: number
) => {
  const options = {
    leading: false,
    trailing: true,
  };
  const isMounted = useIsMounted();
  const inputsRef = useRef({ callbackFn, delay }); // mutable ref like with useThrottle
  useEffect(() => {
    inputsRef.current = { callbackFn, delay };
  });
  return useCallback(
    debounce(
      (...args) => {
        if (inputsRef.current.delay === delay && isMounted())
          inputsRef.current.callbackFn(...args);
      },
      delay,
      options
    ),
    [delay, debounce, callbackFn]
  );
};

export const useIsMounted = () => {
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  return () => isMountedRef.current;
};
