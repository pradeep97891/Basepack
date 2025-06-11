export interface MessageData {
  id: number;
  title: string;
  body: string;
  other: any;
  sent_at: string;
  read_at: null | string;
  status_name: string;
}

export interface ReadAtList {
  id: number[];
  read_at: string | null;
}

export interface userParamData {
  email_id: string;
  project: string;
  page?: number;
}
