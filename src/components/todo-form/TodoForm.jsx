import { useState } from 'react';
import { TodoInput } from './TodoInput';
import { TodoSubmitButton } from './TodoSubmitButton';

export const TodoForm = ({ onCreateTodo }) => {
	const [newTask, setNewTask] = useState('');

	const handleNewTaskChange = (event) => {
		const value = event.target.value;
		setNewTask(value);
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		if (newTask.trim() === '') {
			return;
		}

		try {
			const newTodoData = {
				title: newTask,
				completed: false,
			};

			await onCreateTodo(newTodoData);
			setNewTask('');
		} catch (error) {
			console.error('Ошибка при добавлении задачи:', error);
		}
	};

	return (
		<form className="todo__form" onSubmit={handleFormSubmit}>
			<div className="todo__field field">
				<label className="field__label" htmlFor="new-task">
					New task
				</label>
				<TodoInput
					value={newTask}
					onChange={handleNewTaskChange}
					onSubmit={handleFormSubmit}
				/>
			</div>
			<TodoSubmitButton type="submit">Add</TodoSubmitButton>
		</form>
	);
};
