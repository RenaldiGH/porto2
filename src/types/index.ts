export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}
