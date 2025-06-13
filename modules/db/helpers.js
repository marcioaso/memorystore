import store from './index.js';

export default (storeName)=> ({
    // shared methods for model prototypes
    store: () => {
        return store(storeName);
    },
    byId(id) {
        return store(storeName).getById(id) || null;
    },
    save() {
        if (!this.id) {
            const entry = store(storeName).add(this);
            return entry;
        } else {
            return store(storeName).update(this.id, this);
        }
    },
    remove() {
        if (!this.id) throw new Error('Cannot remove an unsaved object');
        const removed = store(storeName).remove(this.id);
        if (!removed) return false;
        delete this.id;
        return this;
    },
});