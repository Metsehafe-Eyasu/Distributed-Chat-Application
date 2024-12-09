// src/userUtils.js
const axios = require('axios');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:5001';

async function resolveUserId(username) {
  const { data } = await axios.get(`${AUTH_SERVICE_URL}/auth/user-by-username?username=${encodeURIComponent(username)}`);
  return data.id;
}

module.exports = { resolveUserId };
