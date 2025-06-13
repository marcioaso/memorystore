const collections = {}
const store = {
    name: null,
    sequence: 0,
    entries: {},
    getAll: function() {
        return Object.values(this.entries);
    },
    getById: function(id) {
        return this.entries[id] || null
    },
    add: function(entry) {
        this.sequence++;
        entry.id = this.sequence;
        this.entries[entry.id] = entry;
        return entry;
    },
    update: function(id, entry) {
        if (this.entries[id]) {
            this.entries[id] = {...this.entries[id], ...entry};
            return this.entries[id];
        }
        return null;
    },
    remove: function(id) {
        if (this.entries[id]) {
            delete this.entries[id];
            return true;
        }
        return false;
    },
}

module.exports = {
    instance: name => {
        if (!name) throw new Error('Store name is required');
        if (!collections[name]) {
            const storage = Object.assign({
                name,
                sequence: 0,
                entries: {},
            }, store);
            collections[name] = storage;
        }
        return collections[name];
    }
};
