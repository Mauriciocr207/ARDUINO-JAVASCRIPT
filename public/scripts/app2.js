const Data = '$';
for (const i of Data) {
    //Obtener valor Ascii del char
    const AsciiData = i.charCodeAt();

    //Cambiar un decimal a binario
    const binData = AsciiData.toString(2);
    
    //Cambiar un biinario a un decimal
    const toIntData = parseInt(binData,2);
    
    //Obtener el caracter Ascii dado un valor decimal
    const toCharData = String.fromCharCode(toIntData);
    

    const objInfo = {
        0: i,
        1: AsciiData,
        2: binData,
        3: toIntData,
        4: toCharData
    }
}
