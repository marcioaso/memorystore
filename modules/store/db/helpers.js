import store from './index.js';

export default (storeName)=> ({
    store: () => {
        return store(storeName);
    },
    save: () => {
        if (!this.id) {
            return store(storeName).add(this);
        } else {
            return store(storeName).update(this.id, this);
        }
    },
});