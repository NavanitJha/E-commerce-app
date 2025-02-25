# 🛒 E-Commerce Backend  

This is the backend for an eCommerce application, providing APIs for authentication, product listing, shopping cart management, and order processing.  

## 🚀 Features  

### 1️⃣ User Authentication  
- Users can **sign up, log in, and log out**.  
- Implements **JWT-based authentication** for secure access.  

### 2️⃣ Product Listing  
- Fetches and displays a **list of products** via a REST API.  
- Supports **category-based filtering** and **price-based sorting**.  

### 3️⃣ Shopping Cart  
- Users can **add or remove products** from their cart.  
- Displays the **total price** of items in the cart.  

### 4️⃣ Checkout Flow  
- A simple **checkout process** to capture user details.  
- Confirms the **order** after successful submission.  

## 🛠️ Tech Stack  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: JWT (JSON Web Token)  
- **Hosting**: Vercel  

## 🔧 Installation & Setup  

### 1️⃣ Clone the Repository  
git clone <your-repo-url>
cd eCommerce-app/Backend

### 2️⃣ Install Dependencies  
npm install


### 3️⃣ Set Up Environment Variables  
Create a `.env` file in the root directory and add:  

MONGO_URI1=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
PORT=5000

### 4️⃣ Start the Server  
#### Development Mode  
npm start

#### Production Deployment url
https://ecommerce-backend-black-ten.vercel.app/

Testing endpoints of deployed project example:
https://ecommerce-backend-black-ten.vercel.app/api/products

## 🔥 API Endpoints  

| Endpoint                        | Method | Description                 |
|---------------------------------|--------|-----------------------------|
| `/api/auth/register`            | POST   | Register a new user         |
| `/api/auth/login`               | POST   | User login & token issuance |
| `/api/products`                 | GET    | Fetch all products          |
| `/api/cart/add`                 | POST   | Add items to the cart       | 
| `/api/cart/remove/<product_id>` | DELETE | Remove items from the cart  |
| `/api/cart`                     | GET    | View all items of cart      |
| `/api/order/checkout`           | POST   | Place an order              |
| `/api/order`                    | GET    | View order details          |

## 🛠️ Testing API in Browser  
Since **POST requests** cannot be tested directly in a browser, use:  
- **Postman**  
- **cURL (Command Line)**  
- **VS Studio ThunderClient**  

Example postman command to test login:  
Method : POST http://localhost:5000/api/auth/login 
Headers : Content-Type: application/json 
Body :'{"email": "user@example.com", "password": "123456"}'

