import store from './index.js';

export default (storeName)=> ({
    // this will be the prototype for the model instances
    store: () => {
        return store(storeName);
    },
    byId(id) {
        return store(storeName).getById(id) || null;
    },
    save: () => {
        if (!this.id) {
            return store(storeName).add(this);
        } else {
            return store(storeName).update(this.id, this);
        }
    },
});