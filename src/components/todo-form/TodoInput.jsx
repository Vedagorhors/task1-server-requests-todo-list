export const TodoInput = ({ value, onChange, onSubmit }) => {
	return (
		<input
			className="field__input"
			id="new-task"
			placeholder=" "
			autoComplete="off"
			value={value}
			onChange={onChange}
			onKeyDown={(event) => {
				if (event.key === 'Enter') {
					onSubmit(event);
				}
			}}
		/>
	);
};
