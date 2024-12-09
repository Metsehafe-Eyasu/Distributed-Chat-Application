# Real-Time Chat System (Backend Services)

This project implements a real-time chat application’s backend stack using containerized microservices. The system uses JWT-based authentication, MongoDB for persistent storage, RabbitMQ for message/event distribution, and separate services for authentication, messaging (Chat), and WebSocket-based communication.

---

## Architecture Overview

### Services

#### Auth Service
- Manages user registration and login.
- Issues JWT tokens to authenticated users.

#### Chat Service
- Stores and retrieves chat messages from the database.
- Publishes `new_message` events to RabbitMQ when a message is sent.

#### WebSocket Service
- Maintains authenticated WebSocket connections with clients.
- Subscribes to `new_message` events from RabbitMQ to deliver messages in real time.
- Resolves recipient usernames to user IDs via the Auth Service.

---

### Database (MongoDB)
- Stores user credentials (for Auth) and chat messages (for Chat).

### RabbitMQ
- Acts as a message queue for asynchronous event handling.
- Chat Service publishes events; WebSocket Service consumes them.

---

## Architecture Diagram

```
           ┌─────────────────┐
           │      Client     │
           │  (e.g. Postman) │
           └───────┬─────────┘
                   │
        JWT        │
        Auth       │
     ┌─────────────┴─────────────┐
     │        Auth Service       │
     │ /register, /login         │
     │ Issues JWT                │
     └───────────┬───────────────┘
                 │
  ┌──────────────┼─────────────────┐
  │              JWT               │
  │              Auth              │
  ▼                                ▼
┌──────────────────┐         ┌──────────────────┐
│    Chat Service  │         │ WebSocket Service│
│ /chat/send       │         │ ws://...:5003?   │
│ /chat/history    │         │  token=JWT       │
│ Persist Messages │         │ Auth via JWT     │
│ Publish Events   │         │ Subscribe Events │
└───────┬──────────┘         └───────┬──────────┘
        │  Publish "new_message"     │  Consume "new_message"
        │        events              │  events
        ▼                            ▼
     ┌─────────────────┐         ┌──────────────┐
     │    RabbitMQ     │         │    MongoDB   │
     │  fanout exchange│         │  chat/user DB│
     └─────────────────┘         └──────────────┘
```
