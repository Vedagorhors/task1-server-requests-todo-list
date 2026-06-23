// Объединение редюсеров
import { combineReducers } from 'redux';
import { todosReducer } from './todosSlice';
import { uiReducer } from './uiSlice';

export const rootReducer = combineReducers({
	todos: todosReducer,
	ui: uiReducer,
});
