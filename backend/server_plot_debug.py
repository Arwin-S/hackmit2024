# import asyncio
# import websockets
# import json
# import matplotlib.pyplot as plt
# from statemachine.StateMachine import StateMachine

# # Initialize the plot and interactive mode
# plt.ion()
# fig, ax = plt.subplots()
# scat = ax.scatter([], [])
# line, = ax.plot([], [], 'r-')  # Line to connect the trail dots
# trail = []  # To store the last 100 points


# x_min, x_max = -200, 2000
# y_min, y_max = -200, 2000
# trail_len = 40

# y_factor = 0

# ax.set_xlim(x_min, x_max)
# ax.set_ylim(y_min, y_max)


# proc = StateMachine()

# async def process_gaze_data(websocket, path):
#     global trail, scat
#     async for message in websocket:
#         message = json.loads(message)
#         x, y = message["x"], message["y"]
#         proc.add_point(x)
#         avg_x = proc.get_moving_avg()
        
        
#         # print(x, y)
#         print(avg_x)
        
#         # Here you can process the gaze data in real time
#         # For example, you can parse the message and do further computations
#                # Append new points to the trail
#         trail.append((x, y*y_factor))

#         # Keep only the last 100 points
#         if len(trail) > trail_len:
#             trail = trail[-trail_len:]

#         # Update scatter plot data
#         xs, ys = zip(*trail)
#         scat.set_offsets(list(zip(xs, ys)))

#         # Update the line data to connect the trail points
#         line.set_data(xs, ys)


#         # Clear and re-draw the plot
#         ax.set_xlim(x_min, x_max)  # Set appropriate limits for x and y
#         ax.set_ylim(y_min, y_max)
#         plt.draw()
#         plt.pause(0.001)
        
        
#         # response = process(message)
#         # await websocket.send(response)

# # Start the WebSocket server
# start_server = websockets.serve(process_gaze_data, "localhost", 6789)

# asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_forever()



import asyncio
import websockets
import json
import matplotlib.pyplot as plt
import time  # Import time module to handle timestamps
from statemachine.StateMachine import StateMachine

# Initialize the plot and interactive mode
plt.ion()
fig, ax = plt.subplots()
scat = ax.scatter([], [])
line, = ax.plot([], [], 'r-')  # Line to connect the trail dots
trail = []  # To store the points with timestamps

x_min, x_max = -200, 2000
y_min, y_max = 0, 10  # y-axis from 0 to N_seconds (we'll set N_seconds to 10)
N_seconds = 10  # Time window for the y-axis (last N seconds)

ax.set_xlim(x_min, x_max)
ax.set_ylim(y_min, y_max)

# Optional: Invert y-axis if you want time to decrease upwards
# ax.invert_yaxis()

proc = StateMachine()

async def process_gaze_data(websocket, path):
    global trail, scat
    async for message in websocket:
        message = json.loads(message)
        x, y = message["x"], message["y"]
        proc.add_point(x)
        avg_x = proc.get_moving_avg()

        print(avg_x)

        # Get current timestamp
        timestamp = time.time()

        # Append new point with its timestamp
        trail.append((x, timestamp))

        # Remove points older than N_seconds
        current_time = time.time()
        trail = [(x_i, t_i) for x_i, t_i in trail if current_time - t_i <= N_seconds]

        # Calculate y-values based on elapsed time
        xs = [x_i for x_i, t_i in trail]
        ys = [N_seconds - (current_time - t_i) for x_i, t_i in trail]

        # Update scatter plot data
        scat.set_offsets(list(zip(xs, ys)))

        # Update the line data to connect the trail points
        line.set_data(xs, ys)

        # Update plot limits
        ax.set_xlim(x_min, x_max)
        ax.set_ylim(0, N_seconds)  # y-axis from 0 to N_seconds

        # Redraw the plot
        plt.draw()
        plt.pause(0.001)

# Start the WebSocket server
start_server = websockets.serve(process_gaze_data, "localhost", 6789)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
