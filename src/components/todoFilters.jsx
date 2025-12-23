const TodoFilters = ({ search, onSearchChange, onToggleSort, sortAsc }) => {
	return (
		<div>
			<input
				type="text"
				placeholder="Поиск по задачам"
				value={search}
				// onChange={(event) => setSearch(event.target.value)}
				onChange={onSearchChange}
			/>

			<button type="button" onClick={onToggleSort}>
				Сортировать {sortAsc ? 'А-Я' : 'Я-А'}
			</button>
		</div>
	);
};

export default TodoFilters;
