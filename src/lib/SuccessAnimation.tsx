import animationData from "./success.json";

import Lottie from "lottie-react";

export const SuccessAnimation = () => {
  return (
    <Lottie animationData={animationData} loop={false} style={{ height: 100 }} />
  );
};

export default SuccessAnimation;
