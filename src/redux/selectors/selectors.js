// Selectors - функции для получения данных из Redux store
// Используются вместо прямого обращения к state для изоляции компонентов от структуры store

// ========== Selectors для todos slice ==========

// Selector для получения массива задач
// Принимает весь state и возвращает массив задач из todos slice
export const selectTodos = (state) => {
	// state - это весь Redux store
	// state.todos - это todos slice (содержит todos, isLoading, error)
	// state.todos.todos - это массив задач
	return state.todos.todos;
};

// Selector для получения флага загрузки
// Принимает весь state и возвращает isLoading из todos slice
export const selectIsLoading = (state) => {
	// state.todos.isLoading - флаг загрузки (true когда загружаем)
	return state.todos.isLoading;
};

// Selector для получения текста ошибки
// Принимает весь state и возвращает error из todos slice
export const selectError = (state) => {
	// state.todos.error - текст ошибки или null
	return state.todos.error;
};

// ========== Selectors для ui slice ==========

// Selector для получения текста поиска
// Принимает весь state и возвращает search из ui slice
export const selectSearch = (state) => {
	// state.ui.search - текст поиска из input
	return state.ui.search;
};

// Selector для получения направления сортировки
// Принимает весь state и возвращает sortAsc из ui slice
export const selectSortAsc = (state) => {
	// state.ui.sortAsc - направление сортировки (true = А-Я, false = Я-А)
	return state.ui.sortAsc;
};

// ========== Комбинированный selector ==========

// Selector для получения отфильтрованных и отсортированных задач
// Принимает весь state и возвращает массив задач с фильтрацией и сортировкой
export const selectFilteredTodos = (state) => {
	// Получаем данные из state через другие selectors
	const todos = selectTodos(state); // Массив всех задач
	const search = selectSearch(state); // Текст поиска
	const sortAsc = selectSortAsc(state); // Направление сортировки

	// Нормализуем текст поиска: удаляем пробелы и приводим к нижнему регистру
	const normalizedSearch = search.trim().toLowerCase();

	// Фильтруем задачи по тексту поиска
	const filteredTodos = todos.filter((todo) => {
		// Если текст поиска пустой - возвращаем все задачи (фильтр не применяется)
		if (!normalizedSearch) {
			return true;
		}

		// Проверяем, содержится ли текст поиска в названии задачи (без учета регистра)
		return todo.title.toLowerCase().includes(normalizedSearch);
	});

	// Сортируем отфильтрованные задачи по названию
	const sortedTodos = filteredTodos.sort((a, b) => {
		// Приводим названия задач к нижнему регистру для корректной сортировки
		const titleA = a.title.toLowerCase();
		const titleB = b.title.toLowerCase();

		// Если sortAsc = true, сортируем А-Я (возрастание)
		if (sortAsc) {
			return titleA.localeCompare(titleB); // Сравниваем строки локально
		}

		// Если sortAsc = false, сортируем Я-А (убывание)
		return titleB.localeCompare(titleA); // Меняем местами для обратной сортировки
	});

	// Возвращаем отфильтрованный и отсортированный массив задач
	return sortedTodos;
};