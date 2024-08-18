const fs = require('fs')

class ProductsManagerFs{
    constructor(path = './src/jsonFiles/products.json'){
        this.path = path
    }

    getProducts = async () => {
        try{
            if(fs.existsSync(this.path)){
                const productsJson = await fs.promises.readFile(this.path , 'utf-8') //LEEMOS EL ARCHIVO

                if(productsJson.length == 0){ //SI NO HAY PRODUCTOS REGISTRADOS
                    return []
                }
    
                const productsJs = JSON.parse(productsJson) //PARSEAMOS
        
                return productsJs //PRODUCTOS PARSEADOS
            }else{
                return [] //NO HAY PRODUCTOS
            }
        }catch(error){
            console.error(error)

            return []
        }
    }

    saveProduct = async (newProduct) => {
        try{
            const products = await this.getProducts() //AGARRAMOS LOS PRODUCTOS

            products.push(newProduct) //PUSHEAMOS EL NUEVO PRODUCTO
            await fs.promises.writeFile(this.path , JSON.stringify(products , null , '\t')) //ESCRIBIMOS EN EL ARCHIVO

            return (newProduct) //DEVOLVEMOS EL PRODUCTO RECIEN REGISTRADO
        }catch(error){
            console.error(error)
        }
    }

    deleteProduct = async (idToDelete) => {
        try{
            const products = await this.getProducts() //AGARRAMOS LOS PRODUCTOS
            const updatedProducts = products.filter((prod) => prod.id != idToDelete) //FILTRAMOS
            await fs.promises.writeFile(this.path , JSON.stringify(updatedProducts , null , '\t')) //ESCRIBIMOS EN EL ARCHIVO

            return (updatedProducts) //DEVOLVEMOS LOS NUEVOS PRODUCTOS
        }catch(error){
            console.error(error)
        }
    }
}

module.exports = ProductsManagerFs