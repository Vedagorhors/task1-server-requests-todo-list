import styles from './TodoList.module.css';
import { TodoCheckbox } from './TodoCheckbox';
import { TodoTitle } from './TodoTitle';
import { TodoDeleteButton } from './TodoDeleteButton';

export const TodoItem = ({ todo, onToggle, onDelete }) => {
	return (
		<li className={styles['todo-app__item']}>
			<TodoCheckbox
				checked={todo.completed}
				onChange={() => onToggle(todo.id, !todo.completed)}
			/>
			<TodoTitle>{todo.title}</TodoTitle>
			<TodoDeleteButton onClick={() => onDelete(todo.id)}>Delete</TodoDeleteButton>
		</li>
	);
};
