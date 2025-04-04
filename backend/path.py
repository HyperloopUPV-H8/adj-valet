from typing import Optional

class GlobalPath:
    def __init__(self, value: Optional[str] = None):
        self.value: Optional[str] = value

ADJ_PATH = GlobalPath()
