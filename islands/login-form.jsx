import { useState } from "preact/hooks";

import Button from "@/components/input/button.jsx";

/**
 *
 */
const LoginForm = () => {
	const [failed, setFailed] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);

		const response = await fetch(
			"/api/login",
			{
				method: "POST",
				body: formData
			}
		);

		if (response.status === 200) {
			setFailed(false);
			location.reload();
		}
		else {
			setFailed(true);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col items-start gap-2">
			<div className="flex gap-2 items-center">
				<label htmlFor="username" className="w-24">Username</label>
				<input type="text" name="username" id="username" className="p-2" />
			</div>
			<div className="flex gap-2 items-center">
				<label htmlFor="password" className="w-24">Password</label>
				<input type="password" name="password" id="password" className="p-2" />
			</div>
			<div className="flex gap-4 items-center">
				<Button type="submit" variant="contained">Submit</Button>
				{failed && (<div className="text-red-500">Login failed</div>)}
			</div>
		</form>
	);
};

export default LoginForm;
