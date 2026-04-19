import { useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id?: number;
  sub?: number;
}

export function useCurrentUserId() {
  const [userId] = useState<number | null>(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.id ?? decoded.sub ?? null;
      } catch {
        return null;
      }
    }
    return null;
  });

  return userId;
}
