"""
 begin --> left
 left --> right
 right --> begin


"""


class StateMachine:
    def __init__(self) -> None:
        self.state = "begin"

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
