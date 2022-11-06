import sys, json
data = {
    "input": "11111111 01101000 01101111 01101100 01100001 00000000"
}

string = data["input"]


def binario_a_decimal(numero_binario): # el parametro es un string del binario
	numero_decimal = 0 

	for posicion, digito_string in enumerate(numero_binario[::-1]):
		numero_decimal += int(digito_string) * 2 ** posicion

	return int(numero_decimal)

arrayStringBin = string.split(" ")
arrrayOfDecimals = []
message = ''
for i in range(len(arrayStringBin)):
    arrrayOfDecimals.append ( binario_a_decimal(arrayStringBin[i]) )

payLoad = []
for i in range(len(arrrayOfDecimals)):
    payLoad.append( arrrayOfDecimals[i] )
payLoad.remove(255)
payLoad.remove(0)
for i in payLoad:
    message += chr(i)


messageBinary = arrayStringBin
messageDecimal= arrrayOfDecimals
text__message = message 


data["message"] = messageBinary
data["messageDecimal"] = messageDecimal
data["message__messageDecimal"] = text__message

dataToSend = json.dumps(data)
print(dataToSend)

sys.stdout.flush()
