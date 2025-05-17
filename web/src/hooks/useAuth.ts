import { useState, useEffect, useCallback } from "react";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

// Define a User type/interface
interface User {
  id?: string; // Assuming the JWT or a subsequent API call might provide user ID
  email?: string;
}

// Define types for login and register function arguments
interface AuthCredentials {
  email: string;
  password: string;
}

// Helper function to get token from localStorage
const getToken = (): string | null => localStorage.getItem("authToken");

// Helper function to set token in localStorage
const setToken = (token: string): void => localStorage.setItem("authToken", token);

// Helper function to remove token from localStorage
const removeToken = (): void => localStorage.removeItem("authToken");

export const useAuth = () => {
	const [authToken, setAuthToken] = useState<string | null>(getToken());
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const currentToken = getToken();
		if (currentToken) {
			setAuthToken(currentToken);
			// TODO: Decode token here to set user details or fetch user details from an endpoint
			// For now, if a token exists, we consider the user authenticated.
			// Example: setUser({ email: 'user@example.com' }); // Placeholder if email is in token or fetched
		}
	}, []);

	const login = useCallback(async ({ email, password }: AuthCredentials) => {
		const response = await fetch(`${API_ENDPOINT}login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			mode: "cors",
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: "Login failed" }));
			throw new Error(errorData.error || "Login failed");
		}

		const data = await response.json();
		if (data.token) {
			setToken(data.token);
			setAuthToken(data.token);
			// Example: setUser({ email }); // Set user based on response or decoded token
		} else {
			throw new Error("Token not found in login response");
		}
		return data;
	}, []);

	const register = useCallback(async ({ email, password }: AuthCredentials) => {
		const response = await fetch(`${API_ENDPOINT}register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			mode: "cors",
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: "Registration failed" }));
			throw new Error(errorData.error || "Registration failed");
		}

		const data = await response.json();
		if (data.token) {
			setToken(data.token);
			setAuthToken(data.token);
			// Example: setUser({ email }); // Set user based on response or decoded token
		} else {
			throw new Error("Token not found in registration response");
		}
		return data;
	}, []);

	const logout = useCallback(() => {
		removeToken();
		setAuthToken(null);
		setUser(null);
	}, []);

	return {
		isAuthenticated: !!authToken,
		user,
		authToken,
		login,
		register,
		logout,
	};
};
