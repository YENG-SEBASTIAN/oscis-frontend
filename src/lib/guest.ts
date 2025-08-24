const GUEST_KEY = "oscis_guest_id";

export async function getGuestId(): Promise<string | null> {
  return localStorage.getItem(GUEST_KEY);
}


export function clearGuestId() {
  localStorage.removeItem(GUEST_KEY);
}
