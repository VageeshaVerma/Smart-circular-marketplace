import { auth } from "../firebase";
import { getIdToken } from "firebase/auth";

export async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");
  return await getIdToken(user, true); // force refresh token
}
