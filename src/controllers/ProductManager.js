import { promises as fs } from 'fs'

class ProductManager {
  constructor(fileName) {
    this.fileName = `./src/models/${fileName}`
    this.count = 0
  }
  async createOrReset(type) {
    try {
      await fs.writeFile(this.fileName, '[]')
      console.log(type)
    } catch (error) {
      console.error(error)
    }
  }

  async saveProduct(title, description, price, thumbnail, code, stock, status) {
    let productsArray = []
    try {
      productsArray = await fs.readFile(this.fileName, 'utf-8')
      productsArray = JSON.parse(productsArray)
      this.count = [...productsArray].pop().id
    } catch (error) {
      try {
        await this.createOrReset('container created')
      } catch (err) {
        console.error(error)
      }
    }
    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status
    }

    if (productsArray.find(prod => prod.code === code)) {
      console.log(`The code ${code} it's already used in the database`)
    } else if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock
    ) {
      console.log('All fields are required')
      return
    }
    if (!status) {
      newProduct.status = true
    }
    productsArray.push({
      ...newProduct,
      id: this.count + 1
    })
    productsArray = JSON.stringify(productsArray, null, 3)
    await fs.writeFile(this.fileName, productsArray)
    return newProduct
  }

  async getById(num) {
    try {
      const id = parseInt(num)
      const data = await fs.readFile(this.fileName, 'utf-8'),
        jsonData = JSON.parse(data),
        found = jsonData.find(product => product.id === id)
      if (found) {
        return found
      } else {
        console.log(`ID "${id}" not found`)
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }
  async getAll() {
    try {
      const data = await fs.readFile(this.fileName, 'utf-8'),
        jsonData = await JSON.parse(data)
      if (data.length > 0) {
        return jsonData
      } else {
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async getOne() {
    try {
      const data = await fs.readFile(this.fileName, 'utf-8')
      const jsonData = await JSON.parse(data)
      if (jsonData.length > 0) {
        const random = parseInt(Math.random() * jsonData.length)
        return jsonData[random]
      } else {
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async putById(id, prop) {
    try {
      let data = await fs.readFile(this.fileName, 'utf-8')
      const jsonData = JSON.parse(data)
      let product = jsonData.find(pro => pro.id == id)
      //si existe lo modifico
      if (product) {
        product = {
          ...product,
          ...prop
        }
        data = jsonData.map(prod => {
          if (prod.id == product.id) {
            return product
          }
          return prod
        })
        const stringData = JSON.stringify(data, null, 3)
        //lo guardo en el archivo
        await fs.writeFile(this.fileName, stringData)
        return product
      } else {
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async deleteById(num) {
    try {
      const data = await fs.readFile(this.fileName, 'utf-8'),
        jsonData = JSON.parse(data),
        foundIndex = jsonData.findIndex(element => element.id === num)
      // if (foundIndex !== -1) {
      //   jsonData.splice(foundIndex, 1)
      //   fs.writeFileSync(this.fileName, JSON.stringify(jsonData, null, 2))
      // } else {
      //   console.log(`ID "${num}" not found`)
      //   return null
      // }
      if (foundIndex !== -1) {
        jsonData.splice(foundIndex, 1)
        fs.writeFileSync(this.fileName, JSON.stringify(jsonData, null, 2))
        return num
      } else {
        console.log(`ID "${num}" not found`)
        return null
      }
    } catch (err) {
      throw new Error(err)
    }
  }
  deleteAll() {
    fs.writeFileSync(`./${this.fileName}`, '[]')
  }
}

let products = new ProductManager('products.json')

export default products
