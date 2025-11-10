import http from 'http'
import express from 'express'
import { Server } from 'socket.io'


export const app = express()

export const server = http.createServer(app)




const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL

const userIdToSocketIdMap = new Map()

const io = new Server(server, {
    cors: {
        origin: FRONTEND_BASE_URL,
        credentials: true
    }
})

io.use((socket) => {
    const userId = socket.handshake.query.userId
    if (!userId) socket.disconnect()
    return
})

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    userIdToSocketIdMap.set(userId, socket.id)
    console.log(`New User Connected to Socket. User Id = ${userId}, socketId = ${socket.id} `)
})