import { cookies } from "next/headers";

import { COOKIE_NAME } from "@/lib/constants";

export async function getAccessToken(): Promise<string | null> {
  const cookieJar = await cookies();
  const accessToken = cookieJar.get(COOKIE_NAME)?.value;
  if (!accessToken) {
    return null;
  }
  return accessToken;
}

