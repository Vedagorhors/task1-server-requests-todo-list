// src/api/todosApi.js — БЭКАП JSON SERVER (НЕ УДАЛЯТЬ)

const BASE_URL = 'http://localhost:3001';
// нужно сделать запрос на /todos, проверить статус, вернуть массив задач
export const getTodos = async () => {
	// делаю запрос
	const response = await fetch(`${BASE_URL}/todos`);
	// проверяю статус ответа
	if (!response.ok) {
		throw new Error('Не удалось загрузить список дел');
	}
	// Преобразовываю ответ в JSON
	// Если ответ успешный, преобразуем тело ответа из JSON‑строки в обычный JS‑массив/объект.
	const data = await response.json();
	// response.json() тоже возвращает промис, поэтому возвращаем его результат наружу.
	// Снаружи тот, кто вызывает getTodos (а это fetchTodos), получит уже готовый массив todos.
	return data;
};

// Создание новой задачи
// Задача функции createTodo: Принимать данные новой задачи (без id), отправлять POST на /todos и возвращать объект, который пришёл от сервера.
export const createTodo = async (todoData) => {
	const response = await fetch(`${BASE_URL}/todos`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json;charset=utf-8' },
		body: JSON.stringify(todoData), // данные, которые мы отправляем на сервер нужно обернуть в JSON.stringify
	});
	if (!response.ok) {
		throw new Error('Не удалось создать задачу');
	}
	const createdTodo = await response.json();
	return createdTodo;
};

// Обновление задачи
export const updateTodo = async (id, updates) => {
	const response = await fetch(`${BASE_URL}/todos/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updates),
	});

	if (!response.ok) {
		throw new Error('Не удалось обновить задачу');
	}

	const updatedTodo = await response.json();
	return updatedTodo;
};

// Удаление задачи
export const deleteTodo = async (id) => {
	const response = await fetch(`${BASE_URL}/todos/${id}`, {
		method: 'DELETE',
	});
	if (!response.ok) {
		throw new Error('Не удалось удалить задачу');
	}

	// JSON Server по умолчанию на DELETE возвращает пустой объект,
	// поэтому нам ничего не нужно парсить. Функция просто завершится,
	// и сам факт успешного выполнения будет означать, что задачу можно
	// удалить из локального state.
};
