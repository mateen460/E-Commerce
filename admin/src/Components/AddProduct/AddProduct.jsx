import React, { useState } from "react";
import './AddProduct.css';
import upload_icon from '../../assets/upload_icon.jpeg'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const AddProduct = () => {
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: '',
        image: "",
        category: "women",
        new_price: '',
        old_price: ''
    })
    const imageHandler = (e) => {
        setImage(e.target.files[0]);

    }
    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
    }
    const Add_Product = async () => {
        console.log(productDetails);
    
        let responseData;
        let product = productDetails;
        let formData = new FormData(); // Capitalize FormData
    
        formData.append('product', image);
    
        await fetch('http://localhost:4000/upload', {
            method: 'POST', // Use 'POST' for method
            headers: {
                Accept: 'application/json'
            },
            body: formData,
        }).then((resp) => resp.json()).then((data) => { 
            responseData = data;
            console.log(productDetails);
             if (responseData.success) {
                    product.image = responseData.image_url;
                    console.log(product);
                    const fetchData = async () => {
                        try {
                            const resp = await fetch('http://localhost:4000/AddProduct', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(product),
                            });
                    
                            if (!resp.ok) {
                                throw new Error('Network response was not ok');
                            }
                    
                            const data = await resp.json();
                    
                            if (data.success) {
                              
                                toast.success("Product Added");
                               
                            } else {
                                toast.error(responseData.error);
                            }
                        } catch (error) {
                            console.error('Error:', error);
                            alert("Failed to add product: " + error.message);
                        }
                    };
                    
                    fetchData();
                    
    
           
        }
            
        });
    };
    
    return (
        <div className="add-product">
            <ToastContainer/>
            <div className="addproduct-itemfeild">
                <p>Product Title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder="Type Here" />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfeild">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder="Type Here" />
                </div>
                <div className="addproduct-itemfeild">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder="Type Here" />
                </div>
            </div>
            <div className="addproduct-itemfeild">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className="add-product-selector">
                    <option value="women">Women</option>
                    <option value="kid">Kid</option>
                    <option value="men">Men</option>
                </select>

            </div>
            <div className="addproduct-itemfeild">
                <label htmlFor="file-input"><img src={image ? URL.createObjectURL(image) : upload_icon} alt="" className=" addproduct-thumbnail-img" /></label>



                <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />

            </div>

            <button onClick={() => { Add_Product() }} className="addproduct-btn">Add</button>

        </div>
    )
}
export default AddProduct;


//     await fetch('http://localhost:4000/AddProduct',{
//         method:'post',
//         headers:{
//             Accept:'applocation/json',
//             'Content-Type':'application/json'
//         },
//         body:JSON.stringify(product),
//     }).then((resp)=>resp.json()).then((data)=>{
//         data.success?alert("product added"):alert()
//     })
// }