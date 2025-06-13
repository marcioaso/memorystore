import store from '../../db/index.js';
import sharedPrototype from '../../db/prototype.js';
import { ChannelModel as template } from './model.js';

const storeName = 'channel';

export default function(data = {}) {
    const newChannel = {
        ...template,
        ...data,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
    };
    Object.setPrototypeOf(newChannel, { // won't appear in Object.keys()
        ...sharedPrototype(storeName),
        create(name, userId) {
            if (!name || !userId) {
                throw new Error('Channel name and user ID are required to create a channel');
            }
            this.name = name;
            this.owner_user_id = userId;
            this.message_ids = [];
            this.user_ids = [userId];
            this.createdAt = new Date().getTime();
            this.updatedAt = new Date().getTime();
            
            return store(storeName).add(this);
        },
        send(message) {
            if (!message.id) {
                message.save();
            }
            this.message_ids.push(message.id);
            this.updatedAt = new Date().getTime();
            const channelStore = store(storeName);
            channelStore.update(this.id, this);
            return this;
        },
        getAllChannelsByUserId(ownerUserId) {
            return store(storeName).getAll()
                .filter(channel => channel.owner_user_id === ownerUserId);
        },
        getMessages() {
            const messageStore = store('message');
            return this.message_ids.map(messageId => messageStore.getById(messageId)).filter(Boolean);
        }
    });
    return newChannel;
};