import { describe, it, expect, beforeEach } from 'vitest'
import store from './index.js'

describe('store', () => {
    let myStore

    beforeEach(() => {
        myStore = store.instance('test')
        myStore.entries = {}
        myStore.sequence = 0
    })

    it('should create a named collection instance', () => {
        const anotherStore = store.instance('another')
        expect(anotherStore).not.toBe(myStore)
        expect(anotherStore.name).toBe('another')
        expect(myStore.name).toBe('test')
    })

    it('should add entries and auto-increment id', () => {
        const entry = myStore.add({ foo: 'bar' })
        expect(entry.id).toBe(1)
        expect(myStore.entries[1]).toEqual(entry)
        const entry2 = myStore.add({ foo: 'baz' })
        expect(entry2.id).toBe(2)
    })

    it('should return all entries with getAll', () => {
        myStore.add({ foo: 'bar' })
        myStore.add({ foo: 'baz' })
        const all = myStore.getAll()
        expect(all.length).toBe(2)
        expect(all[0].foo).toBe('bar')
        expect(all[1].foo).toBe('baz')
    })

    it('should get entry by id', () => {
        const entry = myStore.add({ foo: 'bar' })
        const result = myStore.getById(entry.id)
        expect(result).toEqual(entry)
        const missing = myStore.getById(999)
        expect(missing).toBeNull()
    })

    it('should update an entry', () => {
        const entry = myStore.add({ foo: 'bar' })
        const updated = myStore.update(entry.id, { foo: 'baz', extra: 42 })
        expect(updated.foo).toBe('baz')
        expect(updated.extra).toBe(42)
        const missing = myStore.update(999, { foo: 'nope' })
        expect(missing).toBeNull()
    })

    it('should remove an entry', () => {
        const entry = myStore.add({ foo: 'bar' })
        const removed = myStore.remove(entry.id)
        expect(removed).toBe(true)
        expect(myStore.entries[entry.id]).toBeUndefined()
        const missing = myStore.remove(999)
        expect(missing).toBe(false)
    })
})