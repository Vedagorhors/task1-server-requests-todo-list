// Импортируем хуки useDispatch и useSelector из react-redux
import { useDispatch, useSelector } from 'react-redux';

// Импортируем Redux action toggleSort для переключения направления сортировки
import { toggleSort } from '../../redux/actions';

// Импортируем Redux selector selectSortAsc для получения направления сортировки из store
import { selectSortAsc } from '../../redux/selectors';

// Компонент кнопки переключения сортировки
// Больше не принимает пропы sortAsc и onSortToggle, использует Redux напрямую
export const Sorting = () => {
	// useDispatch - хук для получения функции dispatch для отправки Redux actions
	const dispatch = useDispatch();

	// useSelector - хук для получения данных из Redux store
	const sortAsc = useSelector(selectSortAsc); // Получаем направление сортировки из store

	// Обработчик переключения направления сортировки
	// Не принимает параметров
	const handleSortToggle = () => {
		// Диспатчим Redux action toggleSort (переключает направление)
		dispatch(toggleSort());
	};

	// Возвращаем JSX разметку для рендеринга компонента
	return (
		// Кнопка переключения направления сортировки
		<button type="button" onClick={handleSortToggle}>
			{/* Текст кнопки зависит от направления сортировки */}
			{/* sortAsc = true → "Я-А", sortAsc = false → "А-Я" */}
			Сортировать {sortAsc ? 'Я-А' : 'А-Я'}
		</button>
	);
};