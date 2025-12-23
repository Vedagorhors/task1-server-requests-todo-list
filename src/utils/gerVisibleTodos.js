export const getVisibleTodos = (todos, search, sortAsc) => {
	// 1. Нормализуем поисковую фразу: убираем пробелы по краям и переводим в нижний регистр.
	// Это нужно для корректного поиска без учета регистра и лишних пробелов.
	const normalizedSearch = search.trim().toLowerCase();
	// 2. Создаем отфильтрованный и отсортированный список для отображения.
	//    Не мутируем исходный массив todos из стейта — работаем с его копией.
	// todos — это все задачи из стейта.
	// visibleTodos — это уже отфильтрованные и отсортированные задачи, которые были посчитаны выше по коду, поэтому при рендере нужно обходить именно их
	const visibleTodos = todos
		.filter((todo) => todo && todo.id) // Фильтр undefined/null
		// Шаг 2.1: ФИЛЬТРАЦИЯ по поисковой фразе
		.filter((todo) => {
			// Если поисковая фраза пустая — показываем ВСЕ задачи
			if (!normalizedSearch) {
				return true;
			}

			// Иначе проверяем: содержит ли title задачи (в нижнем регистре) нашу фразу
			// .includes() ищет подстроку, например "купить" найдет "Купить молоко"
			return todo.title.toLowerCase().includes(normalizedSearch);
		})
		// Шаг 2.2: СОРТИРОВКА по алфавиту (после фильтрации)
		.sort((a, b) => {
			// Сравниваем title двух задач с учетом локали (русский алфавит правильно)
			const titleA = a.title.toLowerCase();
			const titleB = b.title.toLowerCase();

			// Если sortAsc = true (A→Z): первая задача должна быть раньше второй
			if (sortAsc) {
				return titleA.localeCompare(titleB);
			}

			// Если sortAsc = false (Z→A): первая задача должна быть ПОЗЖЕ второй
			return titleB.localeCompare(titleA);
		});

	return visibleTodos;
};
