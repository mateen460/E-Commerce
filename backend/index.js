const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require("path");
const cors = require("cors");
const { error } = require("console");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");


app.use(express.json());
app.use(cors());

// mongodb+srv://ecommerce:<password>@cluster0.ofaqgxm.mongodb.net/

mongoose.connect("");

// api creation
app.get("/", (req, res) => {
    res.send("get request is running ");

});
// text image store enging
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`);
    }
})
const upload = multer({ storage: storage });

// upload endpoint for image
app.use("/images", express.static('upload/images'));


app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })

});
// schema for creating product

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,


    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,

    },
})
app.post("/AddProduct", async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,

    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,

    })

})
// api for deleting product
app.post('/remove', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    })
})
//creating api for get all products
app.get("/allproducts", async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Endpoint for searching products
app.post('/search', async (req, res) => {
    try {
        // Perform search by name (case-insensitive, partial match)
        let searchResults = await Product.find({ name: { $regex: req.body.name, $options: 'i' } });

        // Send search results to the client
        res.json(searchResults);
    } catch (error) {
        // Handle errors
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint for searching products by id
app.post('/searchbyid', async (req, res) => {
    try {
        // Perform search by name (case-insensitive, partial match)
        let searchResults = await Product.find({ id:req.body.id });

        // Send search results to the client
        res.json(searchResults);
    } catch (error) {
        // Handle errors
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// schema for user
const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,

    },
    password: {
        type: String,
    },
    cartData:{
        type:Object,
        default:{},

    },
    date:{
        type:Date,
        default:Date.now,
    }

});

app.post('/signup', async (req, res) => {
    try {
        // Validate request body
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, error: "Invalid request body" });
        }

        // Check if user with the same email already exists
        const existingUser = await Users.findOne({ email:req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "User with the same email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Users({
            username,
            email,
            password: hashedPassword, // Store hashed password in the database
        });

        // Save user to the database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ user: { id: newUser.id } },'Secret-ecom');

        // Respond with success and token
        res.json({ success: true, token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

//creating endpoint for user login
app.post('/login',async(req,res)=>{
    if (!req.body.email||!req.body.password) {
        res.json({success:false,error:"Both feilds are mandatory"})
        
    }
    else{
    let user=await Users.findOne({email:req.body.email});
    if (user) {
        const passCompare = await bcrypt.compare(req.body.password,user.password);
       
        if (passCompare) {
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'Secret-ecom');
            res.json({
                success:true,token
            })
        }
        else{
            res.json({success:false,error:"wrong password"});
           
        }
        
    }
    else{
        res.json({success:false,error:"email not found"});
    }
}
})

// creating end for new collectiondata
app.get('/newcollection',async(req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    console.log("New collection fetched");
    res.send(newcollection);

})

//popular in women section
app.get('/popularinwomen',async(req,res)=>{

let products=await Product.find({category:"women"});
let popularinwomen=products.slice(0,4);
console.log("Popular in women fetched");
res.send(popularinwomen);

})
// middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using valid token" });
    }

    try {
        const data = jwt.verify(token, 'Secret-ecom');
        req.user = data.user;
        next(); // Call next to pass control to the next middleware
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using valid token" });
    }
}

// Ensure that JSON request bodies are parsed
app.use(express.json());



// Endpoint for adding product to cart
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("Added", req.body.itemId)
    let userData = await Users.findOne({ _id: req.user.id });

    // Initialize cartData if it doesn't exist
    if (!userData.cartData) {
        userData.cartData = {};
    }

    // Increment item count in cartData
    userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;

    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
});

// Endpoint to remove product from cartdata
app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("Removed", req.body.itemId)
    let userData = await Users.findOne({ _id: req.user.id });

    // Check if item exists in cartData
    if (userData.cartData && userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Removed");
    } else {
        res.status(400).send("Item not found in cart");
    }
});

// Endpoint to get cartdata
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("Get Cart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData || {}); // Return empty object if cartData is null
});


// admin schema
const Admin=mongoose.model('Admin',{
    id:{
        type:String,
    },
    password:{
        type:String,
    }
})
// API for admin login
app.post('/adminlogin', async (req, res) => {
    if (!req.body.id || !req.body.password) {
        res.json({ success: false, error: "Both fields are mandatory" });
        console.log(req.body.id);
        console.log(req.body.password);
    } else {
        if (req.body.id === "admin" && req.body.password === "admin") {
            const token = jwt.sign({ id: req.body.id }, 'Admin'); // Assuming you want to include user ID in the token
            res.json({ success: true, token });
        } else {
            res.json({ success: false, error: "Invalid credentials" });
        }
    }
});



app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    }
    else {
        console.log("Error :" + error);
    }
});










