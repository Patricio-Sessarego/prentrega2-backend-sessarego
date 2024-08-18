const ProductsManagerFs = require('./managers/fileSystem/products.managers')
const viewsRouter = require('./routes/views.router.js')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const express = require('express')
const crypto = require('crypto')

const productService = new ProductsManagerFs
const app = express()
const PORT = 8080

//MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/static' , express.static(__dirname + '/public'))

//HANDLEBARS
app.engine('handlebars' , handlebars.engine())
app.set('views' , __dirname + '/views')
app.set('view engine' , 'handlebars')

//RUTAS
app.use('/' , viewsRouter) //HOME
app.use('/realTimeProducts' , viewsRouter) //REAL TIME PRODUCTS

//ERROR
app.use((error , req , res , next) => {
    console.log(error.stack)
    res.status(500).send('ERROR DE SERVER')
})

//SERVER
const httpServer = app.listen(PORT , () => {
    console.log(`ESCUCHANDO EN EL PUERTO ${PORT}`)
})

const io = new Server(httpServer)

io.on('connection' , async (socket) => {
    const products = await productService.getProducts() //AGARRAMOS LOS PRODUCTOS

    socket.emit('initialProducts' , products) //CARGAMOS LOS PRODUCTOS ACTUALES

    socket.on('newProduct' , async (product) => {
        const products = await productService.getProducts() //AGARRAMOS LOS PRODUCTOS ACTUALIZADOS
        let flag = false
        products.forEach((prod) => {
            if(prod.code.toUpperCase() == product.code.toUpperCase()){
                flag = true
            }
        })

        if(!flag){ //SI EL CODIGO NO EXISTE
            product.id = crypto.randomUUID() //GENERAMOS UN ID
            products.push(product) //PUSHEAMOS EL NUEVO PRODUCTO
            await productService.saveProduct(product) //GUARDAMOS EL NUEVO PRODUCTO
    
            io.emit('productAdded' , product) //ACTUALIZAMOS EN TIEMPO REAL CON EL NUEVO PRODUCTO
        }else{ //SI EL CODIGO EXISTE
            socket.emit('dupCode' , { message: 'EL CODIGO DE LOS PRODUCTOS TIENE QUE SER UNICO'}) //ALERTA DE QUE EL CODIGO YA EXISTE
        }
    })

    socket.on('deletedProduct' , async (productId) => {
        const products = await productService.getProducts() //AGARRAMOS LOS PRODUCTOS
        const updatedProducts = products.filter((prod) => prod.id != productId) //FILTRAMOS
        await productService.deleteProduct(productId) //ELIMINAMOS EL PRODUCTO DE NUESTRO ARCHIVO

        io.emit('productDeleted' , updatedProducts) //ACTUALIZAMOS
    })
})