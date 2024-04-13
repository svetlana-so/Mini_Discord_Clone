import { io } from 'socket.io-client'

const URL = 'http://localhost:8181'

export const socket = io(URL, {
  autoConnect: false,
})
