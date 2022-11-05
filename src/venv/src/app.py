import socket

HOST = "127.0.0.1"
PORT = 65001

# AF_INET -> protocolo IPv4
# SOCK_STREAM -> Uso de TCP
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as socket:
    socket.connect((HOST, PORT))
    socket.sendall(b"hola mundooo desde pythonnn server")
    print(socket)



