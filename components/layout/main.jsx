/**
 *
 * @param props
 * @param props.children
 */
const Main = ({ children }) => (
	<main className="z-0 flex flex-col w-full text-white grow shrink-0 bg-neutral-800 [--main-padding:0rem] md:[--main-padding:2rem] md:p-8">
		{children}
	</main>
);

export default Main;
