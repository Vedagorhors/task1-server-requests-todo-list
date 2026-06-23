// Редьюсер для управления состоянием задач
// todosSlice - бизнес-логика задач - Зависит от API вызовов (thunks)

// Импортируем константы типов actions для использования в switch case
import {
	FETCH_TODOS_REQUEST,
	FETCH_TODOS_SUCCESS,
	FETCH_TODOS_FAILURE,
	CREATE_TODO_REQUEST,
	CREATE_TODO_SUCCESS,
	CREATE_TODO_FAILURE,
	UPDATE_TODO_REQUEST,
	UPDATE_TODO_SUCCESS,
	UPDATE_TODO_FAILURE,
	DELETE_TODO_REQUEST,
	DELETE_TODO_SUCCESS,
	DELETE_TODO_FAILURE,
} from './actions/todosActions';

// Начальное состояние редьюсера (стейт при инициализации приложения)
export const initialTodosState = {
	todos: [], // Массив задач (пустой по умолчанию)
	isLoading: false, // Флаг загрузки (показываем спиннер когда true)
	error: null, // Текст ошибки (null когда нет ошибок)
};

// Редьюсер - чистая функция, которая принимает текущий state и action, возвращает новый state
export const todosReducer = (state = initialTodosState, action) => {
	// Проверяем тип action и выполняем соответствующую логику
	switch (action.type) {
		// ========== FETCH (загрузка всех задач) ==========

		// Начало загрузки задач с сервера
		case FETCH_TODOS_REQUEST:
			// Возвращаем новый объект state с теми же полями, но isLoading: true
			// error сбрасываем в null (ошибка предыдущей загрузки больше не актуальна)
			return {
				...state, // Копируем все поля текущего state (todos остается прежним)
				isLoading: true, // Устанавливаем флаг загрузки
				error: null, // Сбрасываем ошибку
			};

		// Успешная загрузка задач
		case FETCH_TODOS_SUCCESS:
			// Возвращаем новый объект state с загруженными задачами
			return {
				...state, // Копируем все поля текущего state
				todos: action.payload, // Заменяем массив задач на полученный с сервера (action.payload)
				isLoading: false, // Сбрасываем флаг загрузки
				error: null, // Ошибок нет
			};

		// Ошибка при загрузке задач
		case FETCH_TODOS_FAILURE:
			// Возвращаем новый объект state с текстом ошибки
			return {
				...state, // Копируем все поля текущего state
				isLoading: false, // Сбрасываем флаг загрузки
				error: action.payload, // Сохраняем текст ошибки (action.payload - error.message)
			};

		// ========== CREATE (создание новой задачи) ==========

		// Начало создания задачи
		case CREATE_TODO_REQUEST:
			// Возвращаем новый объект state с флагом загрузки
			return {
				...state, // Копируем все поля текущего state
				isLoading: true, // Устанавливаем флаг загрузки
				error: null, // Сбрасываем ошибку
			};

		// Успешное создание задачи
		case CREATE_TODO_SUCCESS:
			// Возвращаем новый объект state с добавленной задачей
			return {
				...state, // Копируем все поля текущего state
				todos: [...state.todos, action.payload], // Добавляем новую задачу в конец массива (action.payload - созданная задача)
				isLoading: false, // Сбрасываем флаг загрузки
				error: null, // Ошибок нет
			};

		// Ошибка при создании задачи
		case CREATE_TODO_FAILURE:
			// Возвращаем новый объект state с текстом ошибки
			return {
				...state, // Копируем все поля текущего state
				isLoading: false, // Сбрасываем флаг загрузки
				error: action.payload, // Сохраняем текст ошибки
			};

		// ========== UPDATE (обновление задачи) ==========

		// Начало обновления задачи
		case UPDATE_TODO_REQUEST:
			// Возвращаем новый объект state с флагом загрузки
			return {
				...state, // Копируем все поля текущего state
				isLoading: true, // Устанавливаем флаг загрузки
				error: null, // Сбрасываем ошибку
			};

		// Успешное обновление задачи
		case UPDATE_TODO_SUCCESS:
			// Возвращаем новый объект state с обновленной задачей
			return {
				...state, // Копируем все поля текущего state
				// Заменяем задачу в массиве: map проходит по всем задачам, если id совпадает - заменяем, иначе оставляем как есть
				todos: state.todos.map((todo) =>
					todo.id === action.payload.id ? action.payload : todo
				),
				isLoading: false, // Сбрасываем флаг загрузки
				error: null, // Ошибок нет
			};

		// Ошибка при обновлении задачи
		case UPDATE_TODO_FAILURE:
			// Возвращаем новый объект state с текстом ошибки
			return {
				...state, // Копируем все поля текущего state
				isLoading: false, // Сбрасываем флаг загрузки
				error: action.payload, // Сохраняем текст ошибки
			};

		// ========== DELETE (удаление задачи) ==========

		// Начало удаления задачи
		case DELETE_TODO_REQUEST:
			// Возвращаем новый объект state с флагом загрузки
			return {
				...state, // Копируем все поля текущего state
				isLoading: true, // Устанавливаем флаг загрузки
				error: null, // Сбрасываем ошибку
			};

		// Успешное удаление задачи
		case DELETE_TODO_SUCCESS:
			// Возвращаем новый объект state без удаленной задачи
			return {
				...state, // Копируем все поля текущего state
				// Удаляем задачу из массива: filter оставляет только те задачи, у которых id не равен удаленному
				todos: state.todos.filter((todo) => todo.id !== action.payload),
				isLoading: false, // Сбрасываем флаг загрузки
				error: null, // Ошибок нет
			};

		// Ошибка при удалении задачи
		case DELETE_TODO_FAILURE:
			// Возвращаем новый объект state с текстом ошибки
			return {
				...state, // Копируем все поля текущего state
				isLoading: false, // Сбрасываем флаг загрузки
				error: action.payload, // Сохраняем текст ошибки
			};

		// Если action type не совпал ни с одним case, возвращаем state без изменений
		default:
			return state;
	}
};