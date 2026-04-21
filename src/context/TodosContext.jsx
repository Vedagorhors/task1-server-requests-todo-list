import { createContext, useContext } from 'react';
import { useTodos } from '../hooks/useTodos';

const TodosContext = createContext();

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

export const useTodosContext = () => {
	const context = useContext(TodosContext);

	if (!context) {
		throw new Error('useTodosContext must be used within a TodosProvider');
	}

	return context;
};
