import clsx from "clsx";
import { startCase } from "npm:lodash-es";

import Button from "@/components/input/button.jsx";
import MobileMenu from "@/islands/mobile-menu.jsx";

/**
 *
 */
const Header = () => {
	const navigationItems = [
		{
			to: "/",
			name: "index",
			title: "Home",
			custom: () => (
				<h1 className="text-4xl font-bold sm:text-5xl">open-match</h1>
			)
		}
	];

	return (
		<header className="z-10 h-24 text-white bg-neutral-900">
			<nav aria-label="Main Navigation" className="w-full h-full">
				<ul className="grid w-full h-full grid-cols-headerMobile sm:grid-cols-header">
					{
						navigationItems
							.map((
								{
									name,
									to = `/${name}`,
									title = startCase(name),
									custom,
									customLink
								},
								index
							) => (
								<li
									className={clsx(
										"min-h-full h-full items-center justify-center first:justify-start",
										{
											"hidden sm:flex": index !== 0,
											flex: index === 0
										}
									)}
									key={name}
								>
									{
										customLink
											? customLink()
											: <a
												href={to}
												target={to.match(/^https?/) ? "_blank" : "_self"}
												className="flex items-center justify-center first:p-6"
											>
												{
													custom
														? custom()
														: <Button variant="transparent" size="2xl">{title}</Button>
												}
											</a>
									}
								</li>
							))
					}
					<MobileMenu items={navigationItems} />
				</ul>
			</nav>
		</header>
	);
};

export default Header;
