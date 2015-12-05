import {Gpio} from 'onoff';
import express from 'express';

const app = express();

const led = new Gpio(21, 'out');
const button = new Gpio(20, 'in', 'both');

const BLINK_DELAY = 250;

let ledState = false;
let blinking = false;

app.get('/', (req, res) => {
	const options = {
		root: `${__dirname}/`,
		dotfiles: 'deny',
		headers: {
			'X-Clacks-Overhead': 'GNU Terry Pratchett'
		}
	};
	res.sendFile('index.html', options);
});

app.get('/toggle/:what', (req, res) => {
	const {what} = req.params;
	switch(what) {
		case 'led': {
			toggleLed();
			res.send({ledState});
			break;
		}
		case 'blink': {
			toggleBlinking();
			res.send({blinking});
			break;
		}
		default: {
			res.status(400).send({error: `${what} is not togglable`});
		}
	}
});

app.get('/status', (req, res) => {
	res.send({ledState, blinking});
});

const server = app.listen(3000, () => {
	const {host, port} = server.address();
	console.log(`Server listening at http://${host}:${port}`);
})

function toggleLed() {
	ledState = !ledState;
	led.writeSync(+ledState);
}

let blinkingInterval;
function toggleBlinking() {
	blinking = !blinking;
	if (blinking) {
		blinkingInterval = setInterval(toggleLed, BLINK_DELAY);
	} else {
		clearInterval(blinkingInterval);
	}
}
