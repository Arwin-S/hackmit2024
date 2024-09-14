from collections import deque
import numpy as np
import time
import math

class StateMachine:
    def __init__(self, left_boundary=400, right_boundary=1200) -> None:
        self.state = "begin"
        self.buffer = deque()
        self.buff_size = 3
        self.left_boundary = left_boundary
        self.right_boundary = right_boundary
        
        self.start_time = None
        self.end_time = None
        self.start_point = None
        self.end_point = None

        self.lines_read = 0

    def add_point(self, x, y):
        self.buffer.append((x, y))
        
        if len(self.buffer) > self.buff_size:
            self.buffer.popleft()

    def get_moving_avg(self):
        # moving average of x values
        return np.mean([point[0] for point in self.buffer]).item()
    
    def transition(self) -> None:
        avg_x = self.get_moving_avg()
        
        # state transitions based on boundaries
        if self.state == "begin" and avg_x < self.left_boundary:
            self.state = "left"
            self.start_time = time.time()
            self.start_point = (avg_x, self.buffer[-1][1])  # Record starting point
            # print(f"Entered left state at: {self.start_point} at time {self.start_time}")
        
        elif self.state == "left" and avg_x > self.right_boundary:
            self.state = "right"
            self.end_time = time.time()
            self.end_point = (avg_x, self.buffer[-1][1])  # Record ending point
            # print(f"Entered right state at: {self.end_point}")
            self.calculate_metrics()

            self.lines_read += 1
            print(f"Lines read: {self.lines_read}")
        
        elif self.state == "right" and avg_x < self.left_boundary:
            self.state = "left"
            self.start_time = time.time()
            self.start_point = (avg_x, self.buffer[-1][1])  # Record starting point for the new cycle
            # print(f"Moved back to left state at: {self.start_point}")

        
        else:
            pass  # no state change

    def calculate_metrics(self):
        if self.start_point and self.end_point:
            distance = math.sqrt((self.end_point[0] - self.start_point[0]) ** 2 + 
                                 (self.end_point[1] - self.start_point[1]) ** 2)
            duration = self.end_time - self.start_time if self.end_time and self.start_time else 0
            speed = distance / duration if duration > 0 else 0
            # print(f"Distance: {distance}")
            # print(f"Duration: {duration} seconds")
            # print(f"Speed: {speed} units/second")

            # reset
            self.start_point = None
            self.end_point = None
            self.start_time = None
            self.end_time = None

    def get_state(self) -> str:
        return self.state
