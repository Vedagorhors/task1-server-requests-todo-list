// Импортируем хуки useDispatch и useSelector из react-redux
import { useDispatch, useSelector } from 'react-redux';

// Импортируем Redux action setSearch для установки текста поиска
import { setSearch } from '../../redux/actions';

// Импортируем Redux selector selectSearch для получения текста поиска из store
import { selectSearch } from '../../redux/selectors';

// Компонент поля поиска задач
// Больше не принимает пропы search и onSearchChange, использует Redux напрямую
export const Search = () => {
	// useDispatch - хук для получения функции dispatch для отправки Redux actions
	const dispatch = useDispatch();

	// useSelector - хук для получения данных из Redux store
	const search = useSelector(selectSearch); // Получаем текст поиска из store

	// Обработчик изменения текста в поле поиска
	// Принимает event (объект события onChange)
	const handleSearchChange = (event) => {
		// event.target.value - текущее значение input
		// Диспатчим Redux action setSearch с новым текстом поиска
		dispatch(setSearch(event.target.value));
	};

	// Возвращаем JSX разметку для рендеринга компонента
	return (
		// Поле ввода для поиска задач
		<input
			type="text"
			placeholder="Поиск по задачам"
			value={search} // Значение из Redux store
			onChange={handleSearchChange} // Обработчик изменения (диспатчит setSearch)
		/>
	);
};