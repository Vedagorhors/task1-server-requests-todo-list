// Импортируем хук useDispatch из react-redux для отправки Redux actions
import { useDispatch } from 'react-redux';

// Импортируем Redux thunk actions для обновления и удаления задач
import { updateTodoAsync, deleteTodoAsync } from '../../redux/actions';

// Импортируем подкомпонент отдельной задачи
import { TodoItem } from './TodoItem';

// Компонент списка задач
// Больше не принимает пропы onToggle и onDelete, использует Redux напрямую
export const TodoList = ({ todos }) => {
	// useDispatch - хук для получения функции dispatch для отправки Redux actions
	const dispatch = useDispatch();

	// Обработчик переключения статуса задачи (выполнено/не выполнено)
	// Принимает id - идентификатор задачи, newCompleted - новый статус
	const handleToggle = (id, newCompleted) => {
		// Диспатчим Redux thunk action updateTodoAsync для обновления задачи на сервере
		dispatch(updateTodoAsync(id, { completed: newCompleted }));
	};

	// Обработчик удаления задачи
	// Принимает id - идентификатор задачи для удаления
	const handleDelete = (id) => {
		// Диспатчим Redux thunk action deleteTodoAsync для удаления задачи с сервера
		dispatch(deleteTodoAsync(id));
	};

	// Возвращаем JSX разметку для рендеринга компонента
	return (
		// Список задач с CSS классом
		<ul className="todo-app__list">
			{/* Проходим по массиву задач и рендерим каждый элемент */}
			{todos.map((todo) => (
				// Компонент отдельной задачи
				<TodoItem
					key={todo.id} // Уникальный ключ для React
					todo={todo} // Объект задачи
					onToggle={handleToggle} // Обработчик переключения статуса (через Redux)
					onDelete={handleDelete} // Обработчик удаления (через Redux)
				/>
			))}
		</ul>
	);
};