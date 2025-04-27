// API endpoints
const API_URL = '/api';

// Función para mostrar resultados en la consola y en la página
function logResult(result) {
    console.log('\n=== GET /api/items Result ===');
    console.log(result);
    
    // Mostrar en la página
    const resultElement = document.getElementById('GET-api-items-result');
    if (resultElement) {
        resultElement.textContent = JSON.stringify(result, null, 2);
    }
}

// Función para manejar errores
function handleError(error) {
    console.error('Error in GET /api/items:', error);
    const resultElement = document.getElementById('GET-api-items-result');
    if (resultElement) {
        resultElement.textContent = `Error: ${error.message}`;
    }
}

// Función para probar GET /api/items
async function testGetItems() {
    try {
        console.log('Testing GET /api/items...');
        const response = await fetch(`${API_URL}/items`);
        const data = await response.json();
        logResult({
            status: response.status,
            data: data
        });
    } catch (error) {
        handleError(error);
    }
}

// Ejecutar pruebas cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Test GET /items
    const testGetItemsButton = document.getElementById('test-get-items');
    const getItemsResult = document.getElementById('GET-api-items-result');

    testGetItemsButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_URL}/items`);
            const data = await response.json();
            getItemsResult.textContent = JSON.stringify(data, null, 2);
            console.log('GET /items response:', data);
        } catch (error) {
            getItemsResult.textContent = `Error: ${error.message}`;
            console.error('GET /items error:', error);
        }
    });

    // Test GET /items/:id
    const testGetItemByIdButton = document.getElementById('test-get-item-by-id');
    const itemIdInput = document.getElementById('item-id-input');
    const getItemByIdResult = document.getElementById('GET-api-items-id-result');

    testGetItemByIdButton.addEventListener('click', async () => {
        const itemId = itemIdInput.value;
        if (!itemId) {
            getItemByIdResult.textContent = 'Please enter an item ID';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/items/${itemId}`);
            const data = await response.json();
            getItemByIdResult.textContent = JSON.stringify(data, null, 2);
            console.log(`GET /items/${itemId} response:`, data);
        } catch (error) {
            getItemByIdResult.textContent = `Error: ${error.message}`;
            console.error(`GET /items/${itemId} error:`, error);
        }
    });

    // Test POST /items
    const testPostItemsButton = document.getElementById('test-post-items');
    const postItemsResult = document.getElementById('POST-api-items-result');

    testPostItemsButton.addEventListener('click', async () => {
        const id = document.getElementById('item-id').value;
        const name = document.getElementById('item-name').value;
        const type = document.getElementById('item-type').value;
        const effect = document.getElementById('item-effect').value;

        if (!id || !name || !type || !effect) {
            postItemsResult.textContent = 'Please fill in all fields';
            return;
        }

        const item = { id: parseInt(id), name, type, effect };

        try {
            const response = await fetch(`${API_URL}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            });
            
            const data = await response.json();
            postItemsResult.textContent = JSON.stringify(data, null, 2);
            console.log('POST /items response:', data);

            // Limpiar el formulario después de una respuesta exitosa
            if (response.ok) {
                document.getElementById('item-id').value = '';
                document.getElementById('item-name').value = '';
                document.getElementById('item-type').value = '';
                document.getElementById('item-effect').value = '';
            }
        } catch (error) {
            postItemsResult.textContent = `Error: ${error.message}`;
            console.error('POST /items error:', error);
        }
    });

    // Test PUT /items/:id
    const testPutItemButton = document.getElementById('test-put-item');
    const putItemsResult = document.getElementById('PUT-api-items-result');

    testPutItemButton.addEventListener('click', async () => {
        const itemId = document.getElementById('update-item-id').value;
        if (!itemId) {
            putItemsResult.textContent = 'Please enter an item ID';
            return;
        }

        const updateData = {};
        const name = document.getElementById('update-item-name').value;
        const type = document.getElementById('update-item-type').value;
        const effect = document.getElementById('update-item-effect').value;

        if (name) updateData.name = name;
        if (type) updateData.type = type;
        if (effect) updateData.effect = effect;

        if (Object.keys(updateData).length === 0) {
            putItemsResult.textContent = 'Please enter at least one field to update';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            
            const data = await response.json();
            putItemsResult.textContent = JSON.stringify(data, null, 2);
            console.log(`PUT /items/${itemId} response:`, data);
        } catch (error) {
            putItemsResult.textContent = `Error: ${error.message}`;
            console.error(`PUT /items/${itemId} error:`, error);
        }
    });

    // Test DELETE /items/:id
    const testDeleteItemButton = document.getElementById('test-delete-item');
    const deleteItemsResult = document.getElementById('DELETE-api-items-result');

    testDeleteItemButton.addEventListener('click', async () => {
        const itemId = document.getElementById('delete-item-id').value;
        if (!itemId) {
            deleteItemsResult.textContent = 'Please enter an item ID';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/items/${itemId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            deleteItemsResult.textContent = JSON.stringify(data, null, 2);
            console.log(`DELETE /items/${itemId} response:`, data);
        } catch (error) {
            deleteItemsResult.textContent = `Error: ${error.message}`;
            console.error(`DELETE /items/${itemId} error:`, error);
        }
    });

    // Test GET /users
    const testGetUsersButton = document.getElementById('test-get-users');
    const getUsersResult = document.getElementById('GET-api-users-result');

    testGetUsersButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_URL}/users`);
            const data = await response.json();
            getUsersResult.textContent = JSON.stringify(data, null, 2);
            console.log('GET /users response:', data);
        } catch (error) {
            getUsersResult.textContent = `Error: ${error.message}`;
            console.error('GET /users error:', error);
        }
    });

    // Test GET /users/:id
    const testGetUserByIdButton = document.getElementById('test-get-user-by-id');
    const userIdInput = document.getElementById('user-id-input');
    const getUserByIdResult = document.getElementById('GET-api-users-id-result');

    testGetUserByIdButton.addEventListener('click', async () => {
        const userId = userIdInput.value;
        if (!userId) {
            getUserByIdResult.textContent = 'Please enter a user ID';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/${userId}`);
            const data = await response.json();
            getUserByIdResult.textContent = JSON.stringify(data, null, 2);
            console.log(`GET /users/${userId} response:`, data);
        } catch (error) {
            getUserByIdResult.textContent = `Error: ${error.message}`;
            console.error(`GET /users/${userId} error:`, error);
        }
    });

    // Test POST /users
    const testPostUsersButton = document.getElementById('test-post-users');
    const postUsersResult = document.getElementById('POST-api-users-result');

    testPostUsersButton.addEventListener('click', async () => {
        const id = document.getElementById('user-id').value;
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const itemsInput = document.getElementById('user-items').value;
        
        if (!id || !name || !email || !itemsInput) {
            postUsersResult.textContent = 'Please fill in all fields';
            return;
        }

        const items = itemsInput.split(',').map(id => parseInt(id.trim()));
        if (items.some(isNaN)) {
            postUsersResult.textContent = 'Please enter valid item IDs separated by commas';
            return;
        }

        const user = { id: parseInt(id), name, email, items };

        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            
            const data = await response.json();
            postUsersResult.textContent = JSON.stringify(data, null, 2);
            console.log('POST /users response:', data);

            // Limpiar el formulario después de una respuesta exitosa
            if (response.ok) {
                document.getElementById('user-id').value = '';
                document.getElementById('user-name').value = '';
                document.getElementById('user-email').value = '';
                document.getElementById('user-items').value = '';
            }
        } catch (error) {
            postUsersResult.textContent = `Error: ${error.message}`;
            console.error('POST /users error:', error);
        }
    });

    // Test PUT /users/:id
    const testPutUserButton = document.getElementById('test-put-user');
    const putUserResult = document.getElementById('PUT-api-users-result');

    testPutUserButton.addEventListener('click', async () => {
        const userId = document.getElementById('userId').value;
        if (!userId) {
            putUserResult.textContent = 'Please enter a user ID';
            return;
        }

        const updateData = {};
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const items = document.getElementById('userItems').value;

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (items) updateData.items = items.split(',').map(id => parseInt(id.trim()));

        if (Object.keys(updateData).length === 0) {
            putUserResult.textContent = 'Please enter at least one field to update';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();
            
            if (response.ok) {
                putUserResult.textContent = JSON.stringify(data, null, 2);
            } else {s
                putUserResult.textContent = JSON.stringify(data, null, 2);
            }
        } catch (error) {
            putUserResult.textContent = `Error: ${error.message}`;
        }
    });

    // Test DELETE /users/:id
    const testDeleteUserButton = document.getElementById('test-delete-user');
    const deleteUserResult = document.getElementById('DELETE-api-users-result');

    testDeleteUserButton.addEventListener('click', async () => {
        const userId = document.getElementById('delete-user-id').value;
        if (!userId) {
            deleteUserResult.textContent = 'Please enter a user ID';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            deleteUserResult.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            deleteUserResult.textContent = `Error: ${error.message}`;
        }
    });
}); 