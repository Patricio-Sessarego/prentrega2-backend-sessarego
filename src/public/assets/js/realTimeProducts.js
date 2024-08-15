const socket = io()

let submitButton = document.getElementById('submit') //BOTON REGISTRAR

socket.on('initialProducts' , products => { //CARGAMOS LOS PRODUCTOS ACTUALES
    let noProducts = document.getElementById('noProducts') //SI NO HAY PRODUCTOS
    let divProducts = document.getElementById('productos') //SI HAY 1 O MAS PRODUCTOS

    console.log('PRODUCTOS: ' , products) //MOSTRAMOS LOS PRODUCTOS

    if(products.length == 0){ //SI NO HAY PRODUCTOS...
        if(noProducts.classList.contains('d-none')){
            noProducts.classList.remove('d-none')
        }

        if(divProducts.classList.contains('productos')){
            divProducts.classList.remove('productos')
        }
    }else{ //SI HAY 1 O MAS PRODUCTOS REGISTRADOS
        divProducts.classList.add('productos')
        noProducts.classList.add('d-none')

        divProducts.innerHTML = ''
        products.forEach((product) => {
            const div = document.createElement("div") //DIV QUE VA A CONTENER EL PRODUCTO
            div.classList.add("producto") //LE AGREGAMOS LA CLASE PRODUCTO
    
            //CARGAMOS EL DIV
            div.innerHTML = `
                <p class="categoriaProducto"> ${product.category.toUpperCase()} <i class="bi bi-tags-fill"></i> </p>
                <p class="nombreProducto"> ${product.title.toUpperCase()} <i class="bi bi-person-fill"></i> </p>
                <p class="codigoProducto"> ${product.code.toUpperCase()} <i class="bi bi-upc-scan"></i> </p>
                <p class="precioProducto"> ${ponerComas(product.price)} <i class="bi bi-currency-dollar"></i> </p>
                <p class="stockProducto"> ${ponerComas(product.stock)} <i class="bi bi-box-seam-fill"></i> </p>
            `
            divProducts.append(div) //APPEND DEL DIV
        })
    }
})

submitButton.addEventListener('click' , (event) => { //REGISTRAMOS UN NUEVO PRODUCTO
    event.preventDefault() //PREVENIMOS EL REFRESH DEL FORM

    let category = document.getElementById('inputCategoria')
    let price = document.getElementById('inputPrecio')
    let stock = document.getElementById('inputStock')
    let title = document.getElementById('inputTitle')
    let code = document.getElementById('inputCodigo')

    if(category.value.trim().length == 0 || price.value.trim().length == 0 || stock.value.trim().length == 0 || title.value.trim().length == 0 || code.value.trim().length == 0){
        Swal.fire({ //SI FALTA LLENAR ALGUN CAMPO MOSTRAMOS UNA ALERTA
            text: 'POR FAVOR, LLENE TODOS LOS CAMPOS',
            confirmButtonText: 'ACEPTAR',
            confirmButtonColor: '#d33',
            background: '#fff3f3',
            iconColor: '#f27474',
            title: '¡ATENCION!',
            padding: '20px',
            icon: 'error',

            customClass: {
                title: 'swalTitle', //CLASE CSS
                content: 'swalContent', //CLASE CSS
                confirmButton: 'swalConfirmButton' //CLASE CSS
            }
        });
    }else{ //SI ESTAN TODOS LOS CAMPOS LLENOS
        const newProduct = {
            category: category.value.trim(),
            price: price.value.trim(),
            stock: stock.value.trim(),
            title: title.value.trim(),
            code: code.value.trim(),
            status: true,
        }

        //RESTEAMOS EL FORMULARIO
        category.value = ''
        price.value = ''
        stock.value = ''
        title.value = ''
        code.value = ''

        socket.emit('newProduct' , newProduct) //EMITIMOS 'newProduct'

        Swal.fire({ //ALERTA DE QUE SE AGREGO CORRECTAMENTE
            text: 'EL PRODUCTO SE AGREGO CORRECTAMENTE.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ACEPTAR',
            background: '#e3f2fd',
            iconColor: '#4caf50',
            title: '¡EXITO!',
            padding: '20px',
            icon: 'success',
            
            customClass: {
                title: 'swalTitleSuccess',
                content: 'swalContentSuccess',
                confirmButton: 'swalConfirmButtonSuccess'
            }
        });
    }
})

socket.on('productAdded' , (product) => { //ACTUALIZAMOS EN TIEMPO REAL CON EL NUEVO PRODUCTO
    console.log('PRODUCTO AGREGADO: ' , product) //MOSTRAMOS EL NUEVO PRODUCTO

    let noProducts = document.getElementById('noProducts')
    let divProducts = document.getElementById('productos')

    if(!noProducts.classList.contains('d-none')){ //SI ESTABA VACIO...
        noProducts.classList.add('d-none')
    }

    if(!divProducts.classList.contains('productos')){ //SI ESTABA VACIO...
        divProducts.classList.add('productos')
    }

    const div = document.createElement("div") //DIV QUE VA A CONTENER EL NUEVO PRODUCTO
    div.classList.add("producto") //LE AGREGAMOS LA CLASE PRODUCTO

    //CARGAMOS EL DIV
    div.innerHTML = `
        <p class="categoriaProducto"> ${product.category.toUpperCase()} <i class="bi bi-tags-fill"></i> </p>
        <p class="nombreProducto"> ${product.title.toUpperCase()} <i class="bi bi-person-fill"></i> </p>
        <p class="codigoProducto"> ${product.code.toUpperCase()} <i class="bi bi-upc-scan"></i> </p>
        <p class="precioProducto"> ${ponerComas(product.price)} <i class="bi bi-currency-dollar"></i> </p>
        <p class="stockProducto"> ${ponerComas(product.stock)} <i class="bi bi-box-seam-fill"></i> </p>
    `

    divProducts.append(div) //APPEND DEL DIV
})

socket.on('dupCode' , (data) => { //MOSTRAMOS UNA ALERTA DE QUE EL CODIGO TIENE QUE SER UNICO
    Swal.fire({
        confirmButtonText: 'ACEPTAR',
        confirmButtonColor: '#d33',
        background: '#fff3f3',
        iconColor: '#f27474',
        title: '¡ATENCION!',
        text: data.message,
        padding: '20px',
        icon: 'error',

        customClass: {
            title: 'swalTitle', //CLASE CSS
            content: 'swalContent', //CLASE CSS
            confirmButton: 'swalConfirmButton' //CLASE CSS
        }
    })
})

//FUNCIONES
function ponerComas(value){
    let float = parseFloat(value)
    let parseado = float.toLocaleString('en-US', { maximumFractionDigits: 0 });

    return parseado
}

//EVENTOS PARA PREVENIR EL USO DEL ESPACIO
let inputCode = document.getElementById('inputCodigo')
inputCode.addEventListener('keypress' , (event) => {
    if(event.key === ' '){
        event.preventDefault()
    }
})

let inputPrice = document.getElementById('inputPrecio')
inputPrice.addEventListener('keypress' , (event) => {
    if(event.key === ' '){
        event.preventDefault()
    }
})

let inputStock = document.getElementById('inputStock')
inputStock.addEventListener('keypress' , (event) => {
    if(event.key === ' '){
        event.preventDefault()
    }
})