import { TodoItem } from './TodoItem';

export const TodoList = ({ todos, onToggle, onDelete }) => {
	return (
		<ul className="todo-app__list">
			{todos.map((todo) => (
				<TodoItem
					key={todo.id}
					todo={todo}
					onToggle={onToggle}
					onDelete={onDelete}
				/>
			))}
		</ul>
	);
};
