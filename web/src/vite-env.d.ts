/// <reference types="vite/client" />

interface URLData {
  short_code: string;
  original_url: string;
  clicks: number;
  created_at: string; 
  expiry_date?: number | null; 
  view_once?: boolean | null;
  user_id?: string | null;
  display_short_url?: string; 
}

type ClickData = {
	id: string;
	url: string;
	user_ip: string;
	user_agent: string;
	country: string | null;
	created: string;
	updated: string;
};
