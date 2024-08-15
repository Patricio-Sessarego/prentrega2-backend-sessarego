const ProductsManagerFs = require('../managers/fileSystem/products.managers')
const { Router } = require('express')

const productService = new ProductsManagerFs
const router = Router()

router.get('/' , async (req , res) => {
    try{
        const products = await productService.getProducts() //AGARRAMOS LOS PRODUCTOS
        let isProducts = products.length== 0 ? true : false //VACIO O NO?

        products.forEach((product) => { //AJUSTAMOS LOS VALORES DE LOS PRODUCTS
            product.price = ponerComas(product.price) //AGREGAMOS LAS COMAS
            product.stock = ponerComas(product.stock) //AGREGAMOS LAS COMAS

            product.category = product.category.trim().toUpperCase()
            product.title = product.title.trim().toUpperCase()
            product.price = product.price.trim().toUpperCase()
            product.stock = product.stock.trim().toUpperCase()
            product.code = product.code.trim().toUpperCase()
        })

        res.render('home.handlebars' , {
            isProducts: isProducts, //VACIO O NO?
            products: products, //PRODUCTOS
            style: 'home.css', //CSS
            title: 'Home' //TITLE
        })
    }catch(error){
        res.status(500).send(error)
    }
})

router.get('/realTimeProducts' , (req , res) => {
    res.render('realTimeProducts.handlebars' , {
        style: 'realTimeProducts.css', //CSS
        title: 'Real Time' //TITLE
    })
})

module.exports = router

//FUNCIONES
function ponerComas(value){ //FUNCION PARA PONER COMAS EN EL PRECIO
    let float = parseFloat(value)
    let parseado = float.toLocaleString('en-US', { maximumFractionDigits: 0 });

    return parseado
}