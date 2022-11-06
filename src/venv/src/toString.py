import sys
import json

# input = ast.literal_eval(sys.argv[1])
input = sys.argv[1]
data = json.loads(input)
data["input"] = data["input"].strip()
string = data["input"]


def binario_a_decimal(numero_binario):  # el parametro es un string del binario
    numero_decimal = 0

    for posicion, digito_string in enumerate(numero_binario[::-1]):
        numero_decimal += int(digito_string) * 2 ** posicion

    return int(numero_decimal)


arrayStringBin = string.split(" ")
arrrayOfDecimals = []
message = ''

for i in arrayStringBin:
    arrrayOfDecimals.append(binario_a_decimal(i))

payLoad = []
for i in range(len(arrrayOfDecimals)):
    payLoad.append(arrrayOfDecimals[i])
payLoad.remove(255)
payLoad.remove(0)
for i in payLoad:
    message += chr(i)


messageBinary = arrayStringBin
messageDecimal = arrrayOfDecimals
text__message = message

# Se integran los valores al data JSON
data["messageBinary"] = messageBinary
data["messageDecimal"] = messageDecimal
data["text__message"] = text__message

dataToSend = json.dumps(data)
print(dataToSend)

sys.stdout.flush()
