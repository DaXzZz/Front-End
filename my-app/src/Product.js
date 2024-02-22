import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductStyles.css';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async (product) => {
    try {
      const response = await axios.post('http://localhost:5000/products', product);
      if (response.status === 201) {
        fetchProducts();
        setErrorMessage('');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.error);
      } else {
        console.error('Error adding product:', error);
      }
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const updateProduct = async (productId, product) => {
    try {
      await axios.put(`http://localhost:5000/products/${productId}`, product);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();
    const newProduct = {
      ProductId: event.target.productId.value,
      Product_Name: event.target.productName.value,
      Product_Price: parseInt(event.target.productPrice.value, 10),
      Product_Image: event.target.productImage.value,
    };
    addProduct(newProduct);
    event.target.reset();
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    const updatedProduct = {
      Product_Name: event.target.productName.value,
      Product_Price: parseInt(event.target.productPrice.value, 10),
      Product_Image: event.target.productImage.value,
    };
    updateProduct(editingProduct._id, updatedProduct);
    setEditingProduct(null);
  };

  return (
    <div>
      <h1>Products</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleAddFormSubmit}>
        <input name="productId" type="text" placeholder="Product ID" required />
        <input name="productName" type="text" placeholder="Product Name" required />
        <input name="productPrice" type="number" placeholder="Product Price" required />
        <input name="productImage" type="text" placeholder="Product Image URL" required />
        <button type="submit" className="button-85 add-product-btn">Add Product</button>
      </form>
      {products.map((product) => (
        <div key={product._id}>
          {editingProduct && editingProduct._id === product._id ? (
            <form onSubmit={handleEditFormSubmit}>
              <input name="productName" type="text" defaultValue={editingProduct.Product_Name} required />
              <input name="productPrice" type="number" defaultValue={editingProduct.Product_Price} required />
              <input name="productImage" type="text" defaultValue={editingProduct.Product_Image} required />
              <button type="submit" className="button-85">Update Product</button>
              <button onClick={() => setEditingProduct(null)} className="button-85">Cancel</button>
            </form>
          ) : (
            <div>
              <h2 style={{ display: 'inline-block', marginRight: '10px' }}>{`ID: ${product._id} | ${product.Product_Name}`}</h2>
              <button onClick={() => setEditingProduct(product)} className="button-85" style={{ display: 'inline-block', marginRight: '5px' }}>Edit</button>
              <button onClick={() => deleteProduct(product._id)} className="button-85" style={{ display: 'inline-block' }}>Delete</button>
              <h3>Price: {product.Product_Price}</h3>
              <img src={product.Product_Image} alt={product.Product_Name} style={{ display: 'block', marginTop: '10px' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}