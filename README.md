# Store

A simple in-memory data store for Node.js, designed for prototyping and lightweight applications.  
The core is a generic store module, with example modules for `User` and `Messages` built on top.

---

## Features

- **In-memory storage** with named collections
- Auto-incrementing IDs
- CRUD operations: add, get, update, remove
- Model instances have a `.remove()` method to delete themselves from the store
- Extensible for custom models (see User and Messages examples)
- No external dependencies

---

## Core: `modules/store/db`

The core store provides a simple API for managing named collections.

### Usage

```js
import store from './modules/store/db/index.js';

// Create or get a collection
const users = store('users');

// Add an entry
const user = users.add({ name: 'Alice', email: 'alice@example.com' });

// Get all entries
const allUsers = users.getAll();

// Get by ID
const found = users.getById(user.id);

// Update
users.update(user.id, { name: 'Alicia' });

// Remove by ID
users.remove(user.id);
```

---

## Model Instance Methods

When using the User or Messages modules, model instances have helper methods, including `.remove()`:

```js
import User from './modules/store/user.js';

const user = User({ name: 'Bob', email: 'bob@example.com' });
user.save();

// Remove the user instance from the store
user.remove(); // Removes from memory and deletes the `id` property
```

---

## Example: Messages Module

Located at `modules/store/messages`.

```js
import Messages from './modules/store/messages.js';

const message = Messages({ user_id: 1, content: 'Hello world!' });
message.save();

// Like/unlike
message.like(2);
message.unlike(2);

// Commenting
const comment = message.comment({ user_id: 2, content: 'Nice post!' });
const comments = message.getComments();

// Remove the message instance from the store
message.remove();
```

---

## Development

- Requires Node.js (ESM support)
- Run tests with [Vitest](https://vitest.dev/):

```sh
npm test
```

---

## License

ISC