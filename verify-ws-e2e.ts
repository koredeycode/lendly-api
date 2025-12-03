import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5000/api';
const EMAIL = 'koredey4u@gmail.com';
const PASSWORD = 'Yusuf-2706';

async function run() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD,
    });
    const token = loginRes.data.data.accessToken;
    const userId = loginRes.data.data.user?.id;
    console.log('Logged in. User ID:', userId);

    // 2. Get Bookings
    console.log('Fetching bookings...');
    const bookingsRes = await axios.get(`${API_URL}/users/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const bookings = bookingsRes.data.data;
    if (bookings.length === 0) {
      console.log('No bookings found for user. Cannot verify WebSocket.');
      return;
    }
    const bookingId = bookings[0].id;
    console.log('Using Booking ID:', bookingId);

    // 3. Connect to WebSocket
    console.log('Connecting to WebSocket...');
    const socket = io('http://localhost:5000', {
      query: { bookingId },
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      
      // 4. Send Message via API
      console.log('Sending message via API...');
      axios.post(
        `${API_URL}/bookings/${bookingId}/messages`,
        { message: 'Hello from Auth E2E test!' },
        { headers: { Authorization: `Bearer ${token}` } }
      ).then((res) => {
        console.log('Message sent via API:', res.data.message);
      }).catch((err) => {
        console.error('Failed to send message:', err.response?.data || err.message);
      });
    });

    socket.on('messageCreated', (message) => {
      console.log('Received messageCreated event:', message);
      if (message.message === 'Hello from Auth E2E test!') {
        console.log('✅ Verification SUCCESS!');
        socket.disconnect();
        process.exit(0);
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Timeout
    setTimeout(() => {
      console.log('❌ Verification TIMEOUT');
      socket.disconnect();
      process.exit(1);
    }, 10000);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}
run();
