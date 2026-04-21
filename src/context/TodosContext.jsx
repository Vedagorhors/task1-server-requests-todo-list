import { createContext } from 'react';
import { useTodos } from '../hooks/useTodos';

const TodosContext = createContext(null);

export const TodosProvider = ({ children }) => {
	const {
		todos,
		isLoading,
		error,
		createTodo,
		updateTodo,
		deleteTodo,
		toggleCompleted,
	} = useTodos();

	return (
		<TodosContext.Provider
			value={{
				todos,
				isLoading,
				error,
				createTodo,
				updateTodo,
				deleteTodo,
				toggleCompleted,
			}}
		>
			{children}
		</TodosContext.Provider>
	);
};

export { TodosContext };
