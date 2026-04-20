export const Search = ({ search, onSearchChange }) => {
	return (
		<input
			type="text"
			placeholder="Поиск по задачам"
			value={search}
			onChange={onSearchChange}
		/>
	);
};
