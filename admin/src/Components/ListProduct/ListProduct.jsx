
import React, { useEffect, useState } from "react";
import './ListProduct.css';
import remove_icon from '../../assets/remove_icon.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [searchbyid,setSearchbyId]=useState(""); 

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/allproducts')
            .then((res) => res.json())
            .then((data) => setAllProducts(data));
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const remove_product = async (id) => {
        await fetch('http://localhost:4000/remove', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id })
        });
        await fetchInfo();
        toast.success("Product Removed");
    };

    const handleSearch = async () => {
        if(!query.trim()){
            await fetchInfo();
        }

        try {
            const response = await fetch('http://localhost:4000/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: query })
            });
            const data = await response.json();
            setAllProducts(data);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };   
    const handleSearchbyID = async () => {
        if(searchbyid.trim()===""){
            await fetchInfo()

        }
        else{ try {
            const response = await fetch('http://localhost:4000/searchbyid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: searchbyid })
            });
            const data = await response.json();
            setAllProducts(data);
        } catch (error) {
            console.error('Error searching:', error);
        }}
       
    }; 

    return (
        <div className="list-product">
            <ToastContainer/>
            <div className="heading">
                <h1>All Product List</h1>
                <div className="search">
                <div className="search-input">
                    <input type="text" className="search-input-tag" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products By Name" />
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div className="search-input">
                    <input type="number" className="search-input-tag-id" value={searchbyid} onChange={(e) => setSearchbyId(e.target.value)} placeholder="Search products By Id" />
                    <button onClick={handleSearchbyID}>Search</button>
                </div>
                </div>
            </div>
            <div className="listproduct-format-main">
            <p>Product ID</p>
                <p>Product</p>
                <p>Title</p>
                <p>Old Price</p>
                <p>New Price</p>
                <p>Category</p>
                <p>Remove</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {allproducts.map((product, index) => {
                    return (
                        <React.Fragment key={index}>
                            <div className="listproduct-format-main listproduct-format">
                                <p>{product.id}</p>
                                <img src={product.image} alt="" className="listproduct-product-icon" />
                                <p>{product.name}</p>
                                <p>${product.old_price}</p>
                                <p>${product.new_price}</p>
                                <p>{product.category}</p>
                                <img onClick={() => { remove_product(product.id)}} src={remove_icon} alt="" className="listproduct-remove-icon" />
                            </div>
                            <hr />
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default ListProduct;
