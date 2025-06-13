import store from './db/index.js';

const storeName = 'user';

const template = {
    name: '',
    email: '',
}

export default function(data = {}) {
    return ({
        ...template,
        ...data,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        byId(id) {
            return store.instance(storeName).getById(id) || null;
        },
        byEmail(email) {
            return store.instance(storeName).getAll()
                .find(user => user.email === email) || null;
        }
    })
};