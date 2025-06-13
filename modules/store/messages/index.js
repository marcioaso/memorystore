import store from '../../db/index.js';
import sharedHelpers from '../../db/helpers.js';
import { MessageModel as template } from './model.js';
import user from '../user/index.js';

const storeName = 'messages';

export default function(data = {}) {
    const newMessage = {
        ...template,
        ...data,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
    };
    Object.setPrototypeOf(newMessage, { // won't appear in Object.keys()
        ...sharedHelpers(storeName),
        byUserId(userId) {
            return store(storeName).getAll()
                .filter(message => message.user_id === userId);
        },
        byParentId(parentId) {
            return store(storeName).getAll()
                .filter(message => message.parent_id === parentId);
        },
        like(userId) {
            if (!userId) throw new Error('User ID is required to like a message');
            if (this.likes.includes(userId)) return false;
            this.likes.push(userId);
            this.updatedAt = new Date().getTime();

            const messageStore = store(storeName);
            messageStore.update(this.id, this);
            return true;
        },
        unlike(userId) {
            if (!userId) throw new Error('User ID is required to unlike a message');
            if (!this.likes.includes(userId)) return false;
            this.likes = this.likes.filter(id => id !== userId);
            this.updatedAt = new Date().getTime();

            const messageStore = store(storeName);
            messageStore.update(this.id, this);
            return true;
        },
        getComments() {
            const messageStore = store(storeName);
            return this.messages.map(commentId => messageStore.getById(commentId)).filter(Boolean);
        },
        comment(messageData) {
            const messageStore = store(storeName);
            if (!messageData || !messageData.content) {
                throw new Error('Message content is required to comment');
            }

            const newComment = {
                ...messageData,
                parent_id: this.id,
            };

            const comment = messageStore.add(newComment);
            this.messages.push(comment.id);
            this.updatedAt = new Date().getTime();
            messageStore.update(this.id, this);
            return comment;
        }
    });
    return newMessage;
};