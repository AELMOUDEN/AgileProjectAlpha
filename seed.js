const Admin = require('./models/admin');
const Product = require('./models/product');

const admin = {
    username: "Admin",
    email: "AgileProjectHead@gmail.com",
    password: "admin"
}

const productsArray = [{
    productName: "Pink Watch Pro",
    productPrice: 599
}, {
    productName: "Duo Pink Watch Pro",
    productPrice: 999
}];

console.log("SEEDER START");

productsArray.forEach(async function (product) {
    const newProduct = new Product({productName: product.productName, productPrice: product.productPrice });
    await newProduct.save()
    console.log("New Product Saved: " + product);
});

//Admin.create(admin);

console.log("SEEDER END");