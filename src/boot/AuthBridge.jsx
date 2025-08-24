import { useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import user from "../stores/userStore";

export default function AuthBridge() {
  const { user: authUser, signOut } = useAuth();

  useEffect(() => {
    user.attachAuth({ user: authUser, signOut });
  }, [authUser, signOut]);

  return null;
}
