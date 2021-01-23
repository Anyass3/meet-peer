import sveltex from 'stores-x';

import streams from './streams';
import socket from './socket';
import peers from './peers';
import connectome from './connectome.js';

export default sveltex([streams, socket, peers, connectome]);
