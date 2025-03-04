/// <reference types="vite/client" />
type Url = {
	id: string;
	originalUrl: string;
	shortUrl: string;
	clicks: number;
	createdAt: string;
	expiresAt: string | null;
};
