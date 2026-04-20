export const TodoDeleteButton = ({ onClick, children }) => {
	return (
		<button type="button" className="deleteButton" onClick={onClick}>
			{children}
		</button>
	);
};
