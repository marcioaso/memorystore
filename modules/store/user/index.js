import store from '../../db/index.js';
import { UserModel as template } from './model.js';
import sharedHelpers from '../../db/helpers.js';

const storeName = 'user';

export default function(data = {}) {
    const newUser = {
        ...template,
        ...data,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
    };
    Object.setPrototypeOf(newUser, { // won't appear in Object.keys()
        ...sharedHelpers(storeName),
        byEmail(email) {
            return store(storeName).getAll()
                .find(user => user.email === email) || null;
        },
    })
    return newUser
};