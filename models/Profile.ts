interface Profile {
  id: string;
  name: string;
  gender: string | null;
  relationships: string; // JSON string
  occasions: string;    // JSON string
  notifications: string; // JSON string
  additionalInfo: string | null; // JSON string
  userId: string;
}

