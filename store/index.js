import { createStore } from 'redux';
import settingsReducer from './reducers/settings';

const store = createStore(settingsReducer);

export default store;
