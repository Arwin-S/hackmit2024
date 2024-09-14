from collections import deque
import numpy as np

"""
 begin --> left
 left --> right
 right --> begin


"""


class StateMachine:
    def __init__(self) -> None:
        self.state = "begin"
        self.buffer = deque()
        self.buff_size = 10

    def add_point(self, x):
        self.buffer.append(x)
        
        if len(self.buffer) > self.buff_size:
            self.buffer.popleft()
        
    def get_moving_avg(self):
        return np.mean(np.array(self.buffer)).item()
    
    def transition(self) -> None:
        if self.state == "begin":
            self.state = "left"
        elif self.state == "left":
            self.state = "right"
        elif self.state == "right":
            self.state = "begin"
        else:
            raise ValueError("Unknown state")

    def get_state(self) -> str:
        return self.state
