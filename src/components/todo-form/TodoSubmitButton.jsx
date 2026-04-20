export const TodoSubmitButton = ({ type, children }) => {
	return (
		<button className="button" type={type}>
			{children}
		</button>
	);
};
