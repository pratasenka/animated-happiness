# animated-happiness

### Required Environment Variables

To be able to start the server, the following environment variables need to be provided in a file named .env in the root directory.

```javascript
COOKIE_SECRET='your_secret_key'
PORT=3000
POSTGRES_URI='your_postgre_uri'
REDIS_URI='your_redis_uri'
```

### Database

Create the database, create a necessary tables and procedure using this script.

```sql
CREATE TABLE users (
    id VARCHAR(32) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0
);

CREATE TABLE items (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    count INT,
    price DECIMAL(10, 2)
);

CREATE TABLE purchases (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR(32) REFERENCES users (id),
    item_id VARCHAR(32) REFERENCES items (id),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION purchase_item(user_id VARCHAR, item_id VARCHAR)
RETURNS DECIMAL AS $$
DECLARE
    item_price DECIMAL;
    user_balance DECIMAL;
BEGIN
    SELECT price INTO item_price FROM items WHERE id = item_id AND count > 0;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Item not found OR Item out of stock';
    END IF;
   
    
    SELECT balance INTO user_balance FROM users WHERE id = user_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    IF user_balance < item_price THEN
        RAISE EXCEPTION 'Insufficient balance';
    END IF;
    
    UPDATE users SET balance = balance - item_price WHERE id = user_id;
  	UPDATE items SET count = count - 1 WHERE id = item_id;
    
    INSERT INTO purchases (id, user_id, item_id, purchase_date)
    VALUES (gen_random_uuid(), user_id, item_id, CURRENT_TIMESTAMP);
     
    RETURN user_balance - item_price;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;
```

### Dependencies

Install the required Node.js-dependencies.

```
npm install
```


### Start application in dev mode
```
npm run dev
```
