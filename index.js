// server.js

import express from 'express';
import connectDB from './connection/db.js';
import router from './routes/orderRoutes.js';
import bodyParser from 'body-parser';
import process from 'process';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// MongoDB connection
connectDB(process.env.MONGO_URI);

// Middleware
app.use(bodyParser.json());

// Router
app.use(router);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocketServer({ port: 8080 })
const clients = new Set()
wss.on("connection", (ws) => {

	clients.add(ws)

	ws.on("message", (data, isBinary) => {
		clients.forEach((client) => {
			console.log("sending update message")
			if (client !== ws) {
				client.send(JSON.stringify({type: "update_request"}))
			}
		})
	})

	ws.on("close", () => {
		clients.delete(ws)
	})
})
