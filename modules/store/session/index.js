import store from '../../db/index.js';
import sharedPrototype from '../../db/prototype.js';
import { generateToken } from '../../db/utils.js';
import { SessionModel as template } from './model.js';
import { getExpiresAt } from './utils.js';

const storeName = 'session';

export default function(data = {}) {
    const newSession = {
        ...template,
        expires_at: getExpiresAt(),
        token: generateToken(),
        ...data,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
    };
    Object.setPrototypeOf(newSession, { // won't appear in Object.keys()
        ...sharedPrototype(storeName),
        updateExpired() {
            const sessionStore = store(storeName);
            sessionStore.update({
                ...sessionStore.getById(this.id),
                expires_at: getExpiresAt(),
            });
            return this;
        },
        isValid() {
            return this.expires_at > new Date().getTime();
        },
        byToken(token) {
            this.updateExpired();
            return store(storeName).getAll()
                .find(session => session.token === token) || null;
        },
        removeExpired() {
            const now = new Date().getTime();
            const sessionStore = store(storeName);
            const sessions = sessionStore.getAll();
            const expiredSessions = sessions.filter(session => session.expires_at < now);
            expiredSessions.forEach(session => sessionStore.remove(session.id));
            return expiredSessions.map(session => session.id);
        },
        byUserId(userId) {
            this.updateExpired();
            return store(storeName).getAll()
                .filter(session => session.user_id === userId)
                .sort((a, b) => b.created_at - a.created_at)[0] || null;
        },
        login(userId) {
            if (!userId) throw new Error('User ID is required to create a session');            
            const sessionData = {
                user_id: userId,
                token: this.token || generateToken(),
                expires_at: getExpiresAt(),
            };
            
            return store(storeName).add(sessionData);
        },
        logout() {
            store(storeName).remove(this.id);
            delete this.id;
            return this;
        }
    });
    return newSession;
}; 