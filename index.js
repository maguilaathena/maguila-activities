import express from 'express';
import cors from 'cors';
import {checkConnection} from './db_config.js';

const app = express();
const port = 3000;
 
const connection = checkConnection();

app.use(cors());
app.use(express.json());


app.post('/products/get-by-id', async (req, res) => {
    const {product_id} =req.body;

    const query = 'SELECT * FROM products WHERE product_id=?  LIMIT 1';

    connection.query(query, [product_id], (error, result, fields) => {
        if (error) {
            console.error('Error executing query:',error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (result.length > 0) {
            res.json(result[0]); //Return the product details
        } else {
            res.json(false);
        }
        });
});

app.get('/products/get-all', async (req, res) => {
   
    const query = 'SELECT * FROM products';

    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error executing query:',error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (results.length > 0) {
            res.json(results); //Return the product details
        } else {
            res.json(false);
        }
        });
});

app.post('/user/check-user', async (req, res) => {
    const { username, password} = req.body;
    const query = 'SELECT * FROM users WHERE username=? AND password=? LIMIT 1';
    connection.query(query, [username, password], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({error: 'Internal server error' });
            return;
        }
        if (results.length > 0) {
            res.json(true)
    
        } else {
            res.json(false);
        }

    });
});



app.post('/products/update-by-id', (req, res) => {
    const { product_id, product_name, quantity, unit, price } = req.body;

    if (!product_id) {
        return res.status(400).json(false);
    }

    const query = 'UPDATE products SET product_name = ?, quantity = ?, unit = ?, price = ? WHERE product_id = ?';

    connection.query(query, [product_name, quantity, unit, price, product_id], (error, result) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json(false);
            return;
        }

        if (result.affectedRows > 0) {
            res.status(200).json(true);
        } else {
            res.status(404).json(false);
        }
    });
});


app.post('/products/delete-by-id', (req, res) => {
    const { product_id } = req.body;

    if (!product_id) {
        return res.status(400).json(false);
    }

    const query = 'DELETE FROM products WHERE product_id = ?';

    connection.query(query, [product_id], (error, result) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json(false);
            return;
        }

        if (result.affectedRows > 0) {
            res.status(200).json(true);
        } else {
            res.status(404).json(false);
        }
    });
});

app.get('/', (req, res) => {
    res.send('Hello from your express app!');
});

app.listen(port, () => {
    console.log('Server is listening on port ${PORT}');
});

app.get('/users/check-user', (req, res) => {
    res.send('This is a check user Post Yan!');
});
app.post('/users/check-user', (req, res) => {
    const { username, password } = req.body;
    res.send(`Username ${username} Password: ${password}`);
});

app.post('/products/get-info/:product_id', (req, res) => {
    const productId = req.params.product_id; 
    res.send(`This is a sample info route for: ${productId}`);
});

app.get('/products/get-all', (req, res) => {
   

    res.send('This is a sample product route');
});

app.get('/reports/get-monthly', (req, res) => {
   

    res.send('This is a monthly route');
});

app.get('/reports/get-yearly', (req, res) => {
   

    res.send('This is a sample yearly route');
});



