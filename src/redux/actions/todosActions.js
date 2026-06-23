// Импортируем API функции для работы с сервером (CRUD операции)
import { getTodos, createTodo, updateTodo, deleteTodo } from '../../api';

// Типы actions для загрузки задач с сервера
// REQUEST - начало запроса (устанавливаем isLoading: true)
// SUCCESS - успешный ответ от сервера (обновляем todos)
// FAILURE - ошибка при запросе (сохраняем error)

export const FETCH_TODOS_REQUEST = 'FETCH_TODOS_REQUEST';
export const FETCH_TODOS_SUCCESS = 'FETCH_TODOS_SUCCESS';
export const FETCH_TODOS_FAILURE = 'FETCH_TODOS_FAILURE';

export const CREATE_TODO_REQUEST = 'CREATE_TODO_REQUEST';
export const CREATE_TODO_SUCCESS = 'CREATE_TODO_SUCCESS';
export const CREATE_TODO_FAILURE = 'CREATE_TODO_FAILURE';

export const UPDATE_TODO_REQUEST = 'UPDATE_TODO_REQUEST';
export const UPDATE_TODO_SUCCESS = 'UPDATE_TODO_SUCCESS';
export const UPDATE_TODO_FAILURE = 'UPDATE_TODO_FAILURE';

export const DELETE_TODO_REQUEST = 'DELETE_TODO_REQUEST';
export const DELETE_TODO_SUCCESS = 'DELETE_TODO_SUCCESS';
export const DELETE_TODO_FAILURE = 'DELETE_TODO_FAILURE';

// Thunk action creator для загрузки всех задач с сервера
// Это асинхронная функция, которую вызывает компонент при монтировании
export const fetchTodosAsync = () => {
	// Возвращаем функцию, которая принимает dispatch (функция отправки actions)
	return async (dispatch) => {
		// Отправляем action, сигнализирующий о начале загрузки (установить isLoading: true)
		dispatch({ type: FETCH_TODOS_REQUEST });
		try {
			// Делаем асинхронный запрос к серверу (GET /todos) и ждем ответа
			const todos = await getTodos();
			// Успех! Отправляем action с массивом задач (установить todos, isLoading: false)
			dispatch({ type: FETCH_TODOS_SUCCESS, payload: todos });
		} catch (error) {
			// Ошибка! Отправляем action с текстом ошибки (установить error, isLoading: false)
			dispatch({ type: FETCH_TODOS_FAILURE, payload: error.message });
		}
	};
};

// Thunk action creator для создания новой задачи
// Принимает todoData - объект с данными новой задачи { title, completed }
export const createTodoAsync = (todoData) => {
	// Возвращаем функцию, которая принимает dispatch
	return async (dispatch) => {
		// Отправляем action, сигнализирующий о начале создания (isLoading: true)
		dispatch({ type: CREATE_TODO_REQUEST });
		try {
			// Делаем асинхронный запрос к серверу (POST /todos) и ждем созданной задачи
			const createdTodo = await createTodo(todoData);
			// Успех! Отправляем action с созданной задачей (добавляем в todos, isLoading: false)
			dispatch({ type: CREATE_TODO_SUCCESS, payload: createdTodo });
		} catch (error) {
			// Ошибка! Отправляем action с текстом ошибки (установить error, isLoading: false)
			dispatch({ type: CREATE_TODO_FAILURE, payload: error.message });
		}
	};
};

// Thunk action creator для обновления существующей задачи
// Принимает id - идентификатор задачи, updates - объект с изменениями
export const updateTodoAsync = (id, updates) => {
	// Возвращаем функцию, которая принимает dispatch
	return async (dispatch) => {
		// Отправляем action, сигнализирующий о начале обновления (isLoading: true)
		dispatch({ type: UPDATE_TODO_REQUEST });
		try {
			// Делаем асинхронный запрос к серверу (PATCH /todos/:id) и ждем обновленной задачи
			const updatedTodo = await updateTodo(id, updates);
			// Успех! Отправляем action с обновленной задачей (изменяем в todos, isLoading: false)
			dispatch({ type: UPDATE_TODO_SUCCESS, payload: updatedTodo });
		} catch (error) {
			// Ошибка! Отправляем action с текстом ошибки (установить error, isLoading: false)
			dispatch({ type: UPDATE_TODO_FAILURE, payload: error.message });
		}
	};
};

// Thunk action creator для удаления задачи
// Принимает id - идентификатор задачи для удаления
export const deleteTodoAsync = (id) => {
	// Возвращаем функцию, которая принимает dispatch
	return async (dispatch) => {
		// Отправляем action, сигнализирующий о начале удаления (isLoading: true)
		dispatch({ type: DELETE_TODO_REQUEST });
		try {
			// Делаем асинхронный запрос к серверу (DELETE /todos/:id) и ждем удаления
			await deleteTodo(id);
			// Успех! Отправляем action с id удаленной задачи (убираем из todos, isLoading: false)
			dispatch({ type: DELETE_TODO_SUCCESS, payload: id });
		} catch (error) {
			// Ошибка! Отправляем action с текстом ошибки (установить error, isLoading: false)
			dispatch({ type: DELETE_TODO_FAILURE, payload: error.message });
		}
	};
};
