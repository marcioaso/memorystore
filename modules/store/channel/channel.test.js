import { describe, it, expect, beforeEach } from 'vitest';
import store from '../../db/index.js';
import Channel from './index.js';
import Messages from '../message/index.js';

describe('Channel model', () => {
    let channelStore, messageStore;

    beforeEach(() => {
        channelStore = store('channel');
        channelStore.entries = {};
        channelStore.sequence = 1;
        messageStore = store('message');
        messageStore.entries = {};
        messageStore.sequence = 1;
    });

    it('should create a channel with required fields', () => {
        const channel = Channel();
        const created = channel.create('general', 1);
        expect(created.name).toBe('general');
        expect(created.owner_user_id).toBe(1);
        expect(Array.isArray(created.message_ids)).toBe(true);
        expect(Array.isArray(created.user_ids)).toBe(true);
        expect(created.user_ids).toContain(1);
        expect(created.id).toBeDefined();
        expect(channelStore.getById(created.id)).toEqual(created);
    });

    it('should throw if create is called without name or userId', () => {
        const channel = Channel();
        expect(() => channel.create()).toThrow();
        expect(() => channel.create('general')).toThrow();
        expect(() => channel.create(null, 1)).toThrow();
    });

    it('should send a message and store its id', () => {
        const channel = Channel().create('random', 2);
        const message = Messages({ user_id: 2, content: 'Hello!' });
        channel.send(message);
        expect(channel.message_ids.length).toBe(1);
        expect(typeof channel.message_ids[0]).toBe('number');
        expect(messageStore.getById(channel.message_ids[0])).toEqual(message);
    });

    it('should get all messages sent to the channel', () => {
        const channel = Channel().create('dev', 3);
        const msg1 = Messages({ user_id: 3, content: 'First' });
        const msg2 = Messages({ user_id: 3, content: 'Second' });
        channel.send(msg1);
        channel.send(msg2);
        const messages = channel.getMessages();
        expect(messages.length).toBe(2);
        expect(messages[0].content).toBe('First');
        expect(messages[1].content).toBe('Second');
    });

    it('getAllChannelsByUserId should return only channels owned by the given user', () => {
        // Create channels with different owners
        const ch1 = Channel().create('general', 1);
        const ch2 = Channel().create('random', 2);
        const ch3 = Channel().create('dev', 1);

        // Wrap to ensure prototype methods are present
        const wrapper = Channel();

        const user1Channels = wrapper.getAllChannelsByUserId(1);
        const user2Channels = wrapper.getAllChannelsByUserId(2);
        const user3Channels = wrapper.getAllChannelsByUserId(3);

        expect(user1Channels.map(c => c.id).sort()).toEqual([ch1.id, ch3.id].sort());
        expect(user2Channels.map(c => c.id)).toEqual([ch2.id]);
        expect(user3Channels).toEqual([]);
    });
});