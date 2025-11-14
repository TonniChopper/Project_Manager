#!/usr/bin/env python3
"""
WebSocket test client for manual testing.
Usage: python ws_test_client.py [username] [password]
"""
import asyncio
import websockets
import json
import sys


class WebSocketTestClient:
    def __init__(self, token: str, url: str = "ws://localhost:8000/api/v1/ws/connect"):
        self.token = token
        self.url = f"{url}?token={token}"
        self.ws = None

    async def connect(self):
        """Connect to WebSocket server."""
        print(f"Connecting to {self.url}...")
        self.ws = await websockets.connect(self.url)
        print("✓ Connected")

        # Receive welcome message
        welcome = await self.ws.recv()
        data = json.loads(welcome)
        print(f"✓ Welcome: {data['data']['username']}")

    async def send(self, message: dict):
        """Send message to server."""
        await self.ws.send(json.dumps(message))

    async def receive(self):
        """Receive message from server."""
        msg = await self.ws.recv()
        return json.loads(msg)

    async def join_room(self, room: str):
        """Join a room."""
        print(f"\n→ Joining room: {room}")
        await self.send({"type": "join_room", "room": room})

        # Wait for confirmation
        response = await self.receive()
        print(f"✓ {response['type']}: {response.get('data', {}).get('message', '')}")

        # Wait for broadcast
        broadcast = await self.receive()
        print(f"✓ Broadcast: {broadcast['type']}")

    async def leave_room(self, room: str):
        """Leave a room."""
        print(f"\n→ Leaving room: {room}")
        await self.send({"type": "leave_room", "room": room})

        response = await self.receive()
        print(f"✓ {response['type']}")

    async def send_message(self, room: str, content: str):
        """Send message to room."""
        print(f"\n→ Sending to {room}: {content}")
        await self.send({
            "type": "send_message",
            "room": room,
            "data": {"content": content}
        })

        # Wait for broadcast
        response = await self.receive()
        print(f"✓ Broadcast received: {response['data']['username']}: {response['data']['content']}")

    async def ping(self):
        """Send ping."""
        print("\n→ Ping")
        await self.send({"type": "ping"})

        response = await self.receive()
        print(f"✓ Pong: {response['data']['timestamp']}")

    async def listen(self):
        """Listen for incoming messages."""
        print("\n📡 Listening for messages... (Ctrl+C to stop)")
        try:
            async for message in self.ws:
                data = json.loads(message)
                timestamp = data.get("timestamp", "")
                msg_type = data.get("type", "unknown")
                room = data.get("room", "")
                sender = data.get("sender", "")

                print(f"\n[{timestamp}] {msg_type} from {sender or 'server'}")
                if room:
                    print(f"  Room: {room}")
                print(f"  Data: {json.dumps(data.get('data', {}), indent=2)}")
        except KeyboardInterrupt:
            print("\n✓ Stopped listening")

    async def close(self):
        """Close connection."""
        if self.ws:
            await self.ws.close()
            print("\n✓ Disconnected")


async def get_token(username: str, password: str) -> str:
    """Get JWT token from API."""
    import httpx

    async with httpx.AsyncClient() as client:
        # Register if needed
        try:
            await client.post(
                "http://localhost:8000/api/v1/auth/register",
                json={"username": username, "password": password, "email": f"{username}@test.com"}
            )
            print(f"✓ Registered user: {username}")
        except:
            pass  # User might already exist

        # Login
        response = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"username": username, "password": password}
        )

        if response.status_code != 200:
            raise Exception(f"Login failed: {response.text}")

        data = response.json()
        print(f"✓ Logged in as: {username}")
        return data["access_token"]


async def interactive_mode(client: WebSocketTestClient):
    """Interactive command mode."""
    print("\n" + "="*60)
    print("WebSocket Test Client - Interactive Mode")
    print("="*60)
    print("\nCommands:")
    print("  join <room>          - Join a room (e.g., join channel:123)")
    print("  leave <room>         - Leave a room")
    print("  send <room> <msg>    - Send message to room")
    print("  ping                 - Send ping")
    print("  listen               - Listen for incoming messages")
    print("  quit                 - Exit")
    print("\n")

    while True:
        try:
            cmd = input(">>> ").strip()

            if not cmd:
                continue

            parts = cmd.split(maxsplit=2)
            action = parts[0].lower()

            if action == "quit":
                break
            elif action == "join" and len(parts) >= 2:
                await client.join_room(parts[1])
            elif action == "leave" and len(parts) >= 2:
                await client.leave_room(parts[1])
            elif action == "send" and len(parts) >= 3:
                room = parts[1]
                message = parts[2]
                await client.send_message(room, message)
            elif action == "ping":
                await client.ping()
            elif action == "listen":
                await client.listen()
            else:
                print("Invalid command. Type 'help' for commands.")

        except KeyboardInterrupt:
            print("\n")
            break
        except Exception as e:
            print(f"✗ Error: {e}")


async def demo_mode(client: WebSocketTestClient):
    """Automated demo."""
    print("\n" + "="*60)
    print("WebSocket Test Client - Demo Mode")
    print("="*60)

    # Join rooms
    await client.join_room("channel:123")
    await asyncio.sleep(1)

    await client.join_room("project:456")
    await asyncio.sleep(1)

    # Send messages
    await client.send_message("channel:123", "Hello from test client!")
    await asyncio.sleep(1)

    await client.send_message("project:456", "Project update: All tests passing ✓")
    await asyncio.sleep(1)

    # Ping
    await client.ping()
    await asyncio.sleep(1)

    # Leave one room
    await client.leave_room("project:456")
    await asyncio.sleep(1)

    print("\n✓ Demo completed")


async def main():
    if len(sys.argv) < 3:
        print("Usage: python ws_test_client.py <username> <password> [demo|interactive]")
        print("Example: python ws_test_client.py alice Secret123 interactive")
        sys.exit(1)

    username = sys.argv[1]
    password = sys.argv[2]
    mode = sys.argv[3] if len(sys.argv) > 3 else "interactive"

    try:
        # Get token
        token = await get_token(username, password)

        # Connect
        client = WebSocketTestClient(token)
        await client.connect()

        # Run mode
        if mode == "demo":
            await demo_mode(client)
        else:
            await interactive_mode(client)

        # Cleanup
        await client.close()

    except Exception as e:
        print(f"\n✗ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n✓ Bye!")

