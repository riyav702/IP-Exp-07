const express = require('express')
const app = express()
const { products } = require('./data')

app.get('/', (req, res) => {
  res.send('<h1>Home Page</h1><a href="/api/products">See Products</a>')
})

// Products list page
app.get('/api/products', (req, res) => {
  const productList = products
    .map((product) => {
      return `
      <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
        <h2>${product.name}</h2>
        <img src="${product.image}" alt="${product.name}" style="width: 150px; height: 150px;">
        <p><a href="/api/products/${product.id}">View Details</a></p>
      </div>`
    })
    .join('')

  res.send(`
    <h1>Product List</h1>
    ${productList}
    <p><a href="/">Go Back Home</a></p>
  `)
})

// Single product detail page
app.get('/api/products/:productID', (req, res) => {
  const { productID } = req.params
  const singleProduct = products.find(
    (product) => product.id === Number(productID)
  )

  if (!singleProduct) {
    return res.status(404).send('<h1>Product Does Not Exist</h1><a href="/api/products">Go Back</a>')
  }

  res.send(`
    <div style="border: 1px solid #ddd; padding: 10px;">
      <h1>${singleProduct.name}</h1>
      <img src="${singleProduct.image}" alt="${singleProduct.name}" style="width: 250px; height: 250px;">
      <p>${singleProduct.description}</p>
      <p>Price: $${singleProduct.price}</p>
      <p><a href="/api/products">Back to Products</a></p>
    </div>
  `)
})

// Query products (search and limit functionality)
app.get('/api/v1/query', (req, res) => {
  const { search, limit } = req.query
  let sortedProducts = [...products]

  if (search) {
    sortedProducts = sortedProducts.filter((product) =>
      product.name.toLowerCase().startsWith(search.toLowerCase())
    )
  }

  if (limit) {
    sortedProducts = sortedProducts.slice(0, Number(limit))
  }

  if (sortedProducts.length < 1) {
    return res.send('<h1>No Products Matched Your Search</h1><a href="/api/products">Go Back</a>')
  }

  const productList = sortedProducts
    .map((product) => {
      return `
      <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
        <h2>${product.name}</h2>
        <img src="${product.image}" alt="${product.name}" style="width: 150px; height: 150px;">
        <p><a href="/api/products/${product.id}">View Details</a></p>
      </div>`
    })
    .join('')

  res.send(`
    <h1>Search Results</h1>
    ${productList}
    <p><a href="/api/products">Back to Products</a></p>
  `)
})

app.listen(5000, () => {
  console.log('Server is listening on port 5000....')
})