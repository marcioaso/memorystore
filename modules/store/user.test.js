import { describe, it, expect, beforeEach } from 'vitest';
import store from './db';
import User from './user.js';

describe('User model', () => {
    let userStore;

    beforeEach(() => {
        userStore = store.instance('user');
        userStore.entries = {};
        userStore.sequence = 1;
    });

    it('should create a user with default values', () => {
        const user = User();
        expect(user.name).toBe('');
        expect(user.email).toBe('');
        expect(typeof user.createdAt).toBe('number');
        expect(typeof user.updatedAt).toBe('number');
    });

    it('should save a new user and assign an id', () => {
        const user = User({
            name: 'Alice',
            email: 'alice@example.com',
        });
        userStore.add(user);
        expect(user.id).toBeDefined();
        const dbUser = userStore.getById(user.id)
        expect(dbUser).toEqual(user);
    });

    it('should update an existing user', () => {
        const user = User();
        user.name = 'Bob';
        user.email = 'bob@example.com';
        userStore.add(user);
        const oldUpdatedAt = user.updatedAt;
        user.name = 'Bobby';
        userStore.update(user)
        expect(userStore.getById(user.id).name).toBe('Bobby');
        expect(user.updatedAt).toBeGreaterThanOrEqual(oldUpdatedAt);
    });

    it('should find user by id', () => {
        const user = User({
            name: 'Carol',
            email: 'carol@example.com',
        });
        userStore.add(user);
        const found = User().byId(user.id);
        expect(found).toEqual(user);
    });

    it('should find user by email', () => {
        const user = User();
        user.name = 'Dave';
        user.email = 'dave@example.com';
        userStore.add(user);
        const found = User().byEmail('dave@example.com');
        expect(found).toEqual(user);
        const notFound = user.byEmail('nope@example.com');
        expect(notFound).toBeNull();
    });
});