import animationData from "@/lib/success-animation.json";

import Lottie from "lottie-react";

export const SuccessAnimation = () => {
  return (
    <Lottie animationData={animationData} loop={true} style={{ height: 100 }} />
  );
};

export default SuccessAnimation;
