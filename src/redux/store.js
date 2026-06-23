// Импортируем createStore и applyMiddleware для создания store
import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import { rootReducer } from './rootReducer';

// Настраиваем Redux DevTools Extension
// Если в браузере установлено расширение Redux DevTools, используем его
// Иначе используем стандартный compose
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Создаем store с Redux DevTools и Redux Thunk middleware
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
