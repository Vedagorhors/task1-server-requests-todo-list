// Константы типов actions для UI состояния (интерфейса)
// Константы используются чтобы избежать опечаток при отправке actions
export const SET_SEARCH = 'SET_SEARCH';
export const TOGGLE_SORT = 'TOGGLE_SORT';

// Синхронный action creator для установки текста поиска
// Принимает значение поиска и возвращает объект action
export const setSearch = (search) => {
	return {
		// Тип действия - константа, которую редьюсер будет использовать в switch
		type: SET_SEARCH,
		// payload - полезная нагрузка, новые данные (текст поиска)
		payload: search,
	};
};

// Синхронный action creator для переключения направления сортировки
// Не принимает параметров, просто меняет направление на противоположное
export const toggleSort = () => {
	return {
		// Тип действия - константа, которую редьюсер будет использовать в switch
		type: TOGGLE_SORT,
	};
};