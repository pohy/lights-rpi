import {Gpio} from 'onoff';
import express from 'express';

const app = express();

const led = new Gpio(21, 'out');
const button = new Gpio(20, 'in', 'both');

let ledState = false;

app.get('/toggle', (req, res) => {
	toggleLed();
	res.send({ledState});
});

app.get('/status', (req, res) => {
	res.send({ledState});
});

const server = app.listen(3000, () => {
	const {host, port} = server.address();
	console.log(`Server listening at http://${host}:${port}`);
})

function toggleLed() {
	ledState = !ledState;
	led.writeSync(+ledState);
}
