// Импортируем хук useState для управления локальным состоянием формы (текст задачи)
import { useState } from 'react';

// Импортируем хук useDispatch из react-redux для отправки Redux actions
import { useDispatch } from 'react-redux';

// Импортируем Redux thunk action для создания задачи на сервере
import { createTodoAsync } from '../../redux/actions';

// Импортируем подкомпоненты формы
import { TodoInput } from './TodoInput';
import { TodoSubmitButton } from './TodoSubmitButton';

// Компонент формы для создания новой задачи
// Больше не принимает проп onCreateTodo, использует Redux напрямую
export const TodoForm = () => {
	// useDispatch - хук для получения функции dispatch для отправки Redux actions
	const dispatch = useDispatch();

	// Локальное состояние формы для текста новой задачи
	// Это локальное состояние, не хранится в Redux (только пока пользователь печатает)
	const [newTask, setNewTask] = useState('');

	// Обработчик изменения текста в поле ввода
	// Принимает event (объект события onChange)
	const handleNewTaskChange = (event) => {
		// event.target.value - текущее значение input
		const value = event.target.value;
		setNewTask(value); // Обновляем локальное состояние формы
	};

	// Обработчик отправки формы
	// Принимает event (объект события onSubmit)
	const handleFormSubmit = (event) => {
		// Предотвращаем стандартное поведение формы (перезагрузка страницы)
		event.preventDefault();

		// Если текст задачи пустой или только пробелы, не отправляем
		if (newTask.trim() === '') {
			return;
		}

		// Создаем объект с данными новой задачи
		const newTodoData = {
			title: newTask, // Текст задачи из локального состояния
			completed: false, // Статус "не выполнено" по умолчанию
		};

		// Диспатчим Redux thunk action createTodoAsync для создания задачи на сервере
		// thunk автоматически обрабатывает запрос и ошибки через Redux store
		dispatch(createTodoAsync(newTodoData));

		// Очищаем поле ввода после отправки
		setNewTask('');
	};

	// Возвращаем JSX разметку для рендеринга компонента
	return (
		// Форма с CSS классом todo__form
		<form className="todo__form" onSubmit={handleFormSubmit}>
			{/* Контейнер поля ввода с CSS классом */}
			<div className="todo__field field">
				{/* Метка для поля ввода */}
				<label className="field__label" htmlFor="new-task">
					New task
				</label>

				{/* Поле ввода */}
				{/* value - текущее значение из локального состояния */}
				{/* onChange - обработчик изменения текста */}
				{/* onSubmit - обработчик нажатия Enter */}
				<TodoInput value={newTask} onChange={handleNewTaskChange} onSubmit={handleFormSubmit} />
			</div>

			{/* Кнопка отправки формы */}
			{/* type="submit" - при клике срабатывает onSubmit формы */}
			<TodoSubmitButton type="submit">Add</TodoSubmitButton>
		</form>
	);
};