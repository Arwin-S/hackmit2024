import asyncio
import websockets
import json
from statemachine.StateMachine import StateMachine
proc = StateMachine()

async def process_gaze_data(websocket, path):
    async for message in websocket:
        message = json.loads(message)
        x, y = message["x"], message["y"]
        proc.add_point(x)
        avg_x = proc.get_moving_avg()
        
        
        # print(x, y)
        print(avg_x)
        # Here you can process the gaze data in real time
        # For example, you can parse the message and do further computations
        # response = process(message)
        # await websocket.send(response)

# Start the WebSocket server
start_server = websockets.serve(process_gaze_data, "localhost", 6789)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()