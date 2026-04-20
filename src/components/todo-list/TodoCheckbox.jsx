export const TodoCheckbox = ({ checked, onChange }) => {
	return (
		<input className="checkbox" type="checkbox" checked={checked} onChange={onChange} />
	);
};
