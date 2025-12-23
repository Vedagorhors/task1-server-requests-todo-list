export const getVisibleTodos = (todos, search, sortAsc) => {
	const normalizedSearch = search.trim().toLowerCase();
	const visibleTodos = todos
		.filter((todo) => todo && todo.id)
		.filter((todo) => {
			if (!normalizedSearch) {
				return true;
			}

			return todo.title.toLowerCase().includes(normalizedSearch);
		})
		.sort((a, b) => {
			const titleA = a.title.toLowerCase();
			const titleB = b.title.toLowerCase();

			if (sortAsc) {
				return titleA.localeCompare(titleB);
			}

			return titleB.localeCompare(titleA);
		});

	return visibleTodos;
};
