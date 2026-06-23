// Редьюсер для управления UI состоянием (интерфейс)
// uiSlice: 1. состояние интерфейса 2. Чистые синхронные действия 3. Независим от API

// Импортируем константы типов actions для использования в switch case
import { SET_SEARCH, TOGGLE_SORT } from './actions/uiActions';

// Начальное состояние редьюсера (стейт при инициализации приложения)
export const initialUIState = {
	search: '', // Текст поиска (пустой по умолчанию)
	sortAsc: true, // Направление сортировки: true = А-Я, false = Я-А
};

// Редьюсер - чистая функция, которая принимает текущий state и action, возвращает новый state
export const uiReducer = (state = initialUIState, action) => {
	// Проверяем тип action и выполняем соответствующую логику
	switch (action.type) {
		// ========== SET_SEARCH (установка текста поиска) ==========

		// Установка нового текста поиска
		case SET_SEARCH:
			// Возвращаем новый объект state с обновленным текстом поиска
			return {
				...state, // Копируем все поля текущего state (sortAsc остается прежним)
				search: action.payload, // Устанавливаем новый текст поиска (action.payload)
			};

		// ========== TOGGLE_SORT (переключение направления сортировки) ==========

		// Переключение направления сортировки на противоположное
		case TOGGLE_SORT:
			// Возвращаем новый объект state с переключенным направлением
			return {
				...state, // Копируем все поля текущего state (search остается прежним)
				// Инвертируем текущее направление: true -> false, false -> true
				sortAsc: !state.sortAsc,
			};

		// Если action type не совпал ни с одним case, возвращаем state без изменений
		default:
			return state;
	}
};