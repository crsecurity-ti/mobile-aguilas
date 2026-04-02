import { useEffect } from "react";

import { checkIfRoundIsBlockedByTimeDec } from "../utils/utils";

interface CountUpProps {
  actualRoundStartTime?: string;
  blockedTime?: number;
  onRoundIsBlocked?: () => void;
  shouldRender?: boolean;
}

const CountUp = ({
  actualRoundStartTime,
  blockedTime,
  onRoundIsBlocked,
  shouldRender = true,
}: CountUpProps) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        checkIfRoundIsBlockedByTimeDec(
          actualRoundStartTime ?? "",
          blockedTime ?? 0,
        )
      ) {
        onRoundIsBlocked && onRoundIsBlocked();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!shouldRender) return null;
};

export default CountUp;
