import { User, Message } from './modules/store/index.js';

const user = User()
const message = Message()
console.log(Object.keys(user), Object.keys(message));