import { describe, it, expect, beforeEach } from 'vitest';
import store from '../../db/index.js';
import Session from './index.js';
import User from '../user/index.js';

describe('Sessions Module', () => {
    let sessionStore;
    let userStore;

    beforeEach(() => {
        sessionStore = store('session');
        sessionStore.entries = {};
        sessionStore.sequence = 0;
        userStore = store('user');
        userStore.entries = {};
        userStore.sequence = 0;
    });

    it('should create and save a session', () => {
        const session = Session({ user_id: 1, token: 'abc123' });
        session.save();
        expect(session.id).toBeDefined();
        expect(sessionStore.getById(session.id)).toEqual(session);
    });

    it('should update a session', () => {
        const session = Session({ user_id: 2, token: 'def456' });
        session.save();
        session.token = 'updatedToken';
        session.save();
        expect(sessionStore.getById(session.id).token).toBe('updatedToken');
    });

    it('should remove a session', () => {
        const session = Session({ user_id: 3, token: 'ghi789' });
        session.save();
        session.remove();
        expect(session.id).toBeUndefined();
        expect(sessionStore.getById(session.id)).toBeNull();
    });

    it('should find session by user_id if method exists', () => {
        const session = Session({ user_id: 4, token: 'xyz000' });
        session.save();
        const found = session.byUserId(4);
        expect(found).toEqual(session);
    });

    it('should validate session with isValid', () => {
        const session = Session({ user_id: 1, token: 'abc' });
        session.save();
        expect(session.isValid()).toBe(true);

        // Expired session
        const expired = Session({ user_id: 2, token: 'def', expires_at: Date.now() - 10000 });
        expired.save();
        expect(expired.isValid()).toBe(false);
    });

    it('should find session by token with byToken', () => {
        const session = Session({ user_id: 3, token: 'tok123', expiresAt: Date.now() + 10000 });
        session.save();
        const found = session.byToken('tok123');
        expect(found).toEqual(session);

        const notFound = session.byToken('notfound');
        expect(notFound).toBeNull();
    });

    it('should remove expired sessions with removeExpired', () => {
        const valid = Session({ user_id: 4, token: 'valid', expires_at: Date.now() + 10000 }).save();
        const expired = Session({ user_id: 5, token: 'expired', expires_at: Date.now() - 10000 }).save();

        // Remove expired
        const removed = valid.removeExpired();
        expect(removed).toContain(expired.id);
        expect(sessionStore.getById(expired.id)).toBeNull();
        expect(sessionStore.getById(valid.id)).toEqual(valid);
    });

    it('should find session by user id with byUserId', () => {
        const session = Session({ user_id: 6, token: 'tok6', expiresAt: Date.now() + 10000 });
        session.save();
        const found = session.byUserId(6);
        expect(found).toEqual(session);

        const notFound = session.byUserId(999);
        expect(notFound).toBeNull();
    });

    it('should login and create a session', () => {
        const session = Session({ user_id: 7, token: 'tok8', expiresAt: Date.now() + 10000 });
        const loggedIn = session.login(7);
        expect(loggedIn.user_id).toBe(7);
        expect(loggedIn.token).toBe('tok8');
        expect(loggedIn.expires_at).toBeDefined();
        expect(loggedIn.id).toBeDefined();
        expect(sessionStore.getById(loggedIn.id)).toEqual(loggedIn);
    });

    it('should logout and remove the session', () => {
        const session = Session({ user_id: 8, token: 'tok8', expiresAt: Date.now() + 10000 });
        session.save();
        session.logout();
        expect(session.id).toBeUndefined();
        expect(sessionStore.getById(session.id)).toBeNull();
    });

    it('should return the correct user from session.user()', () => {
        // Create and save a user
        const user = User({ name: 'Test User', email: 'testuser@example.com' });
        userStore.add(user);
        const session = Session({ user_id: user.id, token: 'usertoken' });
        session.save();
        const foundUser = session.user();
        expect(foundUser).toEqual(user);
    });
}); 