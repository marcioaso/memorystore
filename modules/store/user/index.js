import store from '../../db/index.js';
import { UserModel as template } from './model.js';
import sharedPrototype from '../../db/prototype.js';

const storeName = 'user';

export default function(data = {}) {
    const newUser = {
        ...template,
        ...data,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
    };
    Object.setPrototypeOf(newUser, { // won't appear in Object.keys()
        ...sharedPrototype(storeName),
        byEmail(email) {
            return store(storeName).getAll()
                .find(user => user.email === email) || null;
        },
    })
    return newUser
};