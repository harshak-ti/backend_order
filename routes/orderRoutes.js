import express from 'express';
import Order from '../models/order_item.js';
import WebSocket from 'ws';

const router = express.Router();
const ws = new WebSocket("ws://localhost:8080")

// API routes
// Get all todo items
router.get('/api/order', async (req, res) => {
	try {
		// Get the current date and remove the time part
		const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

		
	
		// Query to find records where the date matches today's date
		const orders = await Order.find({
		  date: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
		});
		// const orders = await Order.find();
		res.json(orders);
	} catch (err) {
		console.error('Error fetching order:', err);
		res.status(500).json({ error: 'Error fetching order' });
	}
});


// Add a new todo item
router.post('/api/order', async (req, res) => {
	try {
		const {id,order}=req.body
		const new_order = await Order.create({id,order});
		res.json(new_order);
		ws.send(JSON.stringify({type: "update_request"}))
	} catch (err) {
		console.error('Error creating order:', err);
		res.status(500).json({ error: 'Error creating order' });
	}
});

// Update todo
router.put('/api/order/:id', async (req, res) => {
	const {
		params: { id },
	} = req;
	const order = req.body;
	console.log(id)
	console.log(order)
	try {
		const result = await Order.findByIdAndUpdate( id, order, { new: true });
		if (!order)
			return res
				.status(404)
				.json({ ok: false, data: { error: 'Order not found' } });
		ws.send(JSON.stringify({type: "update_request"}))
		return res.status(200).json({ ok: true, data: { result } });
	} catch (error) {
		console.error('Error updating Order', error);
		return res
			.status(500)
			.json({ ok: false, data: { error: 'Error while updating Order' } });
	}
});
router.delete('/api/order/delete/:id', async (req, res) => {
	const { id } = req.params;

	try {
		// Delete records based on the provided collection name
		await Order.findByIdAndDelete(id);
		ws.send(JSON.stringify({type: "update_request"}))
		res.json({ message: 'Records deleted successfully' });
	} catch (error) {
		console.error('Error deleting records:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});
export default router;
