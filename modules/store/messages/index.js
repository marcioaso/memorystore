import store from '../db/index.js';
import sharedHelpers from '../db/helpers.js';
import { MessageModel as template } from './model.js';

const storeName = 'messages';

export default function(data = {}) {
    const newMessage = {
        ...template,
        ...data,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
    };
    Object.setPrototypeOf(newMessage, {
        ...sharedHelpers(storeName),
        byId(id) {
            return store(storeName).getById(id) || null;
        },
        byUserId(userId) {
            return store(storeName).getAll()
                .filter(message => message.user_id === userId);
        },
        like(userId) {
            const messageStore = store(storeName);
            if (!userId) throw new Error('User ID is required to like a message');

            const message = messageStore.getById(this.id);
            if (message && !message.likes.includes(userId)) {
                message.likes.push(userId);
                message.updatedAt = new Date().getTime();
                messageStore.update(this.id, message);
                return true;
            }
            return false;
        },
        unlike(userId) {
            const messageStore = store(storeName);
            if (!userId) throw new Error('User ID is required to unlike a message');

            const message = messageStore.getById(this.id);
            if (message && message.likes.includes(userId)) {
                message.likes = message.likes.filter(id => id !== userId);
                message.updatedAt = new Date().getTime();
                messageStore.update(this.id, message);
                return true;
            }
            return false;
        },
    });
    return newMessage;
};