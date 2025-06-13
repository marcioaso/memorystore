import { describe, it, expect, beforeEach } from 'vitest';
import store from '../db/index.js';
import Messages from './index.js';

describe('Messages model', () => {
    let messagesStore;

    beforeEach(() => {
        messagesStore = store('messages');
        messagesStore.entries = {};
        messagesStore.sequence = 1;
    });

    it('should create a message with default values', () => {
        const msg = Messages();
        expect(msg.user_id).toBeNull();
        expect(msg.content).toBe('');
        expect(typeof msg.createdAt).toBe('number');
        expect(typeof msg.updatedAt).toBe('number');
    });

    it('save method should work', () => {
        const msg = Messages({
            user_id: 1,
            content: 'Hello World',
        }).save();
        expect(msg.id).toBeDefined();
        const dbMsg = messagesStore.getById(msg.id);
        expect(dbMsg).toEqual(msg);
    });

    it('should find message by id', () => {
        const msg = Messages({ user_id: 1, content: 'Hello' });
        const saved = messagesStore.add(msg);
        const found = msg.byId(saved.id);
        expect(found).toEqual(saved);
        const notFound = msg.byId(999);
        expect(notFound).toBeNull();
    });

    it('should find messages by user_id', () => {
        const msg1 = messagesStore.add(Messages({ user_id: 2, content: 'Hi' }));
        const msg2 = messagesStore.add(Messages({ user_id: 2, content: 'Hey' }));
        const msg3 = messagesStore.add(Messages({ user_id: 3, content: 'Yo' }));
        const finder = Messages();
        const user2Messages = finder.byUserId(2);
        expect(user2Messages).toEqual([msg1, msg2]);
        const user3Messages = finder.byUserId(3);
        expect(user3Messages).toEqual([msg3]);
        const user4Messages = finder.byUserId(4);
        expect(user4Messages).toEqual([]);
    });

    it('should allow a user to like a message', () => {
        const msg = Messages({ user_id: 1, content: 'Like me!' });
        const saved = messagesStore.add(msg);
        saved.id = saved.id || 1; // Ensure id is set
        // Like by user 42
        const result = msg.like(42);
        expect(result).toBe(true);
        const updated = messagesStore.getById(saved.id);
        expect(updated.likes).toContain(42);
    });

    it('should not allow the same user to like a message twice', () => {
        const msg = Messages({ user_id: 1, content: 'Like once!' });
        const saved = messagesStore.add(msg);
        saved.id = saved.id || 1;
        msg.like(42);
        const result = msg.like(42);
        expect(result).toBe(false);
        const updated = messagesStore.getById(saved.id);
        expect(updated.likes.filter(id => id === 42).length).toBe(1);
    });

    it('should throw if userId is missing when liking', () => {
        const msg = Messages({ user_id: 1, content: 'Oops' });
        expect(() => msg.like()).toThrow('User ID is required to like a message');
    });

    it('should allow a user to unlike a message', () => {
        const msg = Messages({ user_id: 1, content: 'Unlike me!', likes: [42] });
        const saved = messagesStore.add(msg);
        saved.id = saved.id || 1;
        const result = msg.unlike(42);
        expect(result).toBe(true);
        const updated = messagesStore.getById(saved.id);
        expect(updated.likes).not.toContain(42);
    });

    it('should not allow a user to unlike a message they have not liked', () => {
        const msg = Messages({ user_id: 1, content: 'Never liked' });
        const saved = messagesStore.add(msg);
        saved.id = saved.id || 1;
        const result = msg.unlike(99);
        expect(result).toBe(false);
    });

    it('should throw if userId is missing when unliking', () => {
        const msg = Messages({ user_id: 1, content: 'Oops' });
        const saved = messagesStore.add(msg);
        expect(() => msg.unlike()).toThrow('User ID is required to unlike a message');
    });
});