import { useRouter } from "next/navigation";

/**
 * Navigate to OTP verification page
 */
export const navigateToOtp = () => {
  const router = useRouter();
  router.push("/otp");
};

/**
 * Navigate to signin page after successful verification
 */
export const navigateToSignin = () => {
  const router = useRouter();
  router.push("/signin");
};

/**
 * Navigate to dashboard after successful verification
 */
export const navigateToDashboard = () => {
  const router = useRouter();
  router.push("/dashboard");
};
