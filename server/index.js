import express from 'express'
import { Server } from "socket.io"
import path from 'path'
import { fileURLToPath } from 'url'

const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express() 
app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3000"]
    }
})
io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)

    //upon connection we send message - only to user no one else
    socket.emit('message', "Welcome to Chat App")

    //Upon connection - to all others               broadcast goes to all users except themselves

    socket.broadcast.emit('message', `User ${socket.id.substring(0,5)} connected` )

    //listening for a message event         .on is an event listener
    socket.on('message', data => {
        console.log(data)
        io.emit('message', `${socket.id.substring(0,5)}: ${data}`)  //emits to everyone in the server
    })
    // When user disconnects - to all others

    socket.on('disconnect', () => {
        socket.broadcast.emit('message', `User ${socket.id.substring(0,5)} disconnected`)
    })

    // Listen for activity
    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name)
    })
})
