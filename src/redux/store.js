import { createStore, combineReducers, applyMiddleware } from "redux";
import { createWrapper } from "next-redux-wrapper";
import { plainReducer } from "./reducers/rootReducer";
class StoreManagement {
    constructor() {
        this._reducers = plainReducer;
        this._store = createStore(this.createReducer(this._reducers));
        this._emitChange = () => this._store.replaceReducer(combineReducers(this._reducers));
    }

    createReducer(reducers) {
        const _rootReducer = combineReducers(reducers);
        const _appReducer = (state, action) => _rootReducer(state, action);
        return _appReducer;
    }

    getReducers() {
        return this._reducers;
    }

    getStore() {
        return this._store;
    }

    register(reducer, name) {
        if (this._reducers[name]) return;
        this._reducers[name] = reducer;

        if (this._emitChange) {
            this._emitChange();
        }
    }
}

export const storeManagement = new StoreManagement();
export const registerReducer = (reducer, name) => {
    storeManagement.register(reducer, name);
};

export const store = storeManagement.getStore();
