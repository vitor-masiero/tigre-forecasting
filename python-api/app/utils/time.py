import time

class Time():

    def __init__(self):
        self.start = time.perf_counter()

    def reiniciar(self):
        self.start = time.perf_counter()
    
    def obter_tempo(self):
        return time.perf_counter() - self.start
