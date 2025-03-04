import { useState } from "react";
import PocketBase from "pocketbase";

export const pb = new PocketBase("/server");

export const useAuth = () => {
	const [auth, setAuth] = useState(pb.authStore.isValid);
	const [user, setUser] = useState(pb.authStore.record);

	pb.authStore.onChange(() => {
		setAuth(pb.authStore.isValid);
		setUser(pb.authStore.record);
	});

	return {
		isAuthenticated: auth,
		user,
	};
};
