import sys
import json

# input = ast.literal_eval(sys.argv[1])
input = sys.argv[1]
data = json.loads(input)
string = data["input"]

message = []
messageBinary = []
text__messageBinary = ''
for i in range(len(string)):
    if i == 0:
        message.append('SRT')
        messageBinary.append('11111111')

    message.append(string[i])
    binString = format(ord(string[i]), '0b')
    if len(binString) < 8:
        newZeros = ''
        for j in range(8 - len(binString)):
            newZeros += '0'
    messageBinary.append(newZeros + binString)

    if i == (len(string) - 1):
        message.append('END')
        messageBinary.append('00000000')

for i in range(len(messageBinary)):
    if i + 1 == len(messageBinary):
        text__messageBinary += messageBinary[i]
    else:
        text__messageBinary += messageBinary[i] + ' '
text__messageBinary = str(len(messageBinary)) + "s" + text__messageBinary

# Se integran los valores al data JSON
data["message"] = message
data["messageBinary"] = messageBinary
data["text__messageBinary"] = text__messageBinary

dataToSend = json.dumps(data)
print(dataToSend)

sys.stdout.flush()
