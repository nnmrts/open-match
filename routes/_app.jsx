import FontsStyle from "../components/style/fonts.jsx";
import Footer from "../components/layout/footer.jsx";
import Header from "../components/layout/header.jsx";
import Main from "../components/layout/main.jsx";

import { asset } from "$fresh/runtime.ts";
import LoginForm from "@/islands/login-form.jsx";

/**
 *
 * @param props
 * @param props.Component
 * @param props.state
 * @param props.state.isAllowed
 * @param props.state.user
 */
const App = ({
	Component, state: { isAllowed } = {}
}) => (
	<html>
		<head className="dark" lang="en">
			<meta name="viewport" content="width=device-width,initial-scale=1" />
			<title>open-match</title>
			<FontsStyle />
			<link href={asset("/style/base.css")} rel="stylesheet" />
			<link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" />
			<link rel="icon" href="/favicons/favicon.ico" sizes="any" />
			<link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
			<link rel="manifest" href="/favicons/manifest.webmanifest" />
		</head>
		<body>
			<Header />
			<Main>
				{
					isAllowed
						? <Component />
						: <LoginForm />
				}

			</Main>
			<Footer />
		</body>
	</html>
);

export default App;
