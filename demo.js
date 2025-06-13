import { User, Message, Session } from './modules/store/index.js';

const user = User()
const message = Message()
const session = Session()
console.log(Object.keys(user), Object.keys(message), Object.keys(session));