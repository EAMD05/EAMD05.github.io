async function main() {
    
    const response = await fetch('http://localhost:3000/api/hello/Erick');

    const message = await response.json();

    console.log(response);
    console.log(message);

    const data = {
        id:1,
        name:'sword',
        effect :"deals dammage"
    }

    const response_r = await fetch ('http://localhost:3000/api/recieve_data',{
        method : 'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
    })

    console.log(response_r)
}

main()

// Function to test the GET /items endpoint
async function getItems() {
    const responseDiv = document.getElementById('itemsResponse');
    responseDiv.innerHTML = 'Loading...';
    
    try {
        const response = await fetch('http://localhost:3000/items');
        const data = await response.json();
        
        // Create status element
        const statusElement = document.createElement('span');
        statusElement.className = `status ${response.ok ? 'success' : 'error'}`;
        statusElement.textContent = `Status: ${response.status}`;
        
        // Display formatted response
        responseDiv.innerHTML = '';
        responseDiv.appendChild(statusElement);
        
        const preElement = document.createElement('pre');
        preElement.textContent = JSON.stringify(data, null, 2);
        responseDiv.appendChild(preElement);
        
    } catch (error) {
        responseDiv.innerHTML = `<span class="status error">Error: ${error.message}</span>`;
    }
}

// Function to test the GET /items/:id endpoint
async function getItemById(id) {
    const responseDiv = document.getElementById('itemByIdResponse');
    responseDiv.innerHTML = 'Loading...';
    
    try {
        const response = await fetch(`http://localhost:3000/items/${id}`);
        const data = await response.json();
        
        // Create status element
        const statusElement = document.createElement('span');
        statusElement.className = `status ${response.ok ? 'success' : 'error'}`;
        statusElement.textContent = `Status: ${response.status}`;
        
        // Display formatted response
        responseDiv.innerHTML = '';
        responseDiv.appendChild(statusElement);
        
        const preElement = document.createElement('pre');
        preElement.textContent = JSON.stringify(data, null, 2);
        responseDiv.appendChild(preElement);
        
    } catch (error) {
        responseDiv.innerHTML = `<span class="status error">Error: ${error.message}</span>`;
    }
}

// Function to test the POST /items endpoint
async function postItem(itemData) {
    const responseDiv = document.getElementById('postItemResponse');
    responseDiv.innerHTML = 'Loading...';
    
    try {
        const response = await fetch('http://localhost:3000/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });
        
        const data = await response.json();
        
        // Create status element
        const statusElement = document.createElement('span');
        statusElement.className = `status ${response.ok ? 'success' : 'error'}`;
        statusElement.textContent = `Status: ${response.status}`;
        
        // Display formatted response
        responseDiv.innerHTML = '';
        responseDiv.appendChild(statusElement);
        
        const preElement = document.createElement('pre');
        preElement.textContent = JSON.stringify(data, null, 2);
        responseDiv.appendChild(preElement);
        
    } catch (error) {
        responseDiv.innerHTML = `<span class="status error">Error: ${error.message}</span>`;
    }
}

// Function to handle form submission
function handlePostItem(event) {
    event.preventDefault();
    const form = event.target;
    const itemData = {
        id: parseInt(form.id.value),
        name: form.name.value,
        type: form.type.value,
        effect: form.effect.value
    };
    postItem(itemData);
}

// Function to test the PUT /items/:id endpoint
async function updateItem(id, updates) {
    const responseDiv = document.getElementById('updateItemResponse');
    responseDiv.innerHTML = 'Loading...';
    
    try {
        const response = await fetch(`http://localhost:3000/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        
        const data = await response.json();
        
        // Create status element
        const statusElement = document.createElement('span');
        statusElement.className = `status ${response.ok ? 'success' : 'error'}`;
        statusElement.textContent = `Status: ${response.status}`;
        
        // Display formatted response
        responseDiv.innerHTML = '';
        responseDiv.appendChild(statusElement);
        
        const preElement = document.createElement('pre');
        preElement.textContent = JSON.stringify(data, null, 2);
        responseDiv.appendChild(preElement);
        
    } catch (error) {
        responseDiv.innerHTML = `<span class="status error">Error: ${error.message}</span>`;
    }
}

// Function to handle update form submission
function handleUpdateItem(event) {
    event.preventDefault();
    const form = event.target;
    const id = parseInt(form.updateId.value);
    const updates = {};
    
    if (form.updateName.value) updates.name = form.updateName.value;
    if (form.updateType.value) updates.type = form.updateType.value;
    if (form.updateEffect.value) updates.effect = form.updateEffect.value;
    
    updateItem(id, updates);
}

// Function to test the DELETE /items/:id endpoint
async function deleteItem(id) {
    const responseDiv = document.getElementById('deleteItemResponse');
    responseDiv.innerHTML = 'Loading...';
    
    try {
        const response = await fetch(`http://localhost:3000/items/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        // Create status element
        const statusElement = document.createElement('span');
        statusElement.className = `status ${response.ok ? 'success' : 'error'}`;
        statusElement.textContent = `Status: ${response.status}`;
        
        // Display formatted response
        responseDiv.innerHTML = '';
        responseDiv.appendChild(statusElement);
        
        const preElement = document.createElement('pre');
        preElement.textContent = JSON.stringify(data, null, 2);
        responseDiv.appendChild(preElement);
        
    } catch (error) {
        responseDiv.innerHTML = `<span class="status error">Error: ${error.message}</span>`;
    }
}

// Function to handle delete form submission
function handleDeleteItem(event) {
    event.preventDefault();
    const form = event.target;
    const id = parseInt(form.deleteId.value);
    deleteItem(id);
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', getItems);

// Function to test the GET /users endpoint
async function getUsers() {
    const responseDiv = document.getElementById('usersResponse');
    responseDiv.innerHTML = 'Loading...';
    
    try {
        const response = await fetch('http://localhost:3000/users');
        const data = await response.json();
        
        // Create status element
        const statusElement = document.createElement('span');
        statusElement.className = `status ${response.ok ? 'success' : 'error'}`;
        statusElement.textContent = `Status: ${response.status}`;
        
        // Display formatted response
        responseDiv.innerHTML = '';
        responseDiv.appendChild(statusElement);
        
        const preElement = document.createElement('pre');
        preElement.textContent = JSON.stringify(data, null, 2);
        responseDiv.appendChild(preElement);
        
    } catch (error) {
        responseDiv.innerHTML = `<span class="status error">Error: ${error.message}</span>`;
    }
}

// Test function for GET /users/:id endpoint
async function testGetUserById() {
    try {
        // Test case 1: Valid user ID
        const validUserId = 1; // Assuming user with ID 1 exists
        const response1 = await fetch(`http://localhost:3000/users/${validUserId}`);
        const data1 = await response1.json();
        console.log('Test case 1 - Valid user ID:');
        console.log('Status:', response1.status);
        console.log('Response:', data1);

        // Test case 2: Invalid user ID
        const invalidUserId = 999; // Assuming this ID doesn't exist
        const response2 = await fetch(`http://localhost:3000/users/${invalidUserId}`);
        const data2 = await response2.json();
        console.log('\nTest case 2 - Invalid user ID:');
        console.log('Status:', response2.status);
        console.log('Response:', data2);

    } catch (error) {
        console.error('Error during testing:', error);
    }
}

// Run the tests
testGetUserById();

// Function to test the GET /users/:id endpoint
async function getUserById(id) {
    const responseDiv = document.getElementById('userByIdResponse');
    responseDiv.innerHTML = 'Loading...';
    
    try {
        const response = await fetch(`http://localhost:3000/users/${id}`);
        const data = await response.json();
        
        // Create status element
        const statusElement = document.createElement('span');
        statusElement.className = `status ${response.ok ? 'success' : 'error'}`;
        statusElement.textContent = `Status: ${response.status}`;
        
        // Display formatted response
        responseDiv.innerHTML = '';
        responseDiv.appendChild(statusElement);
        
        const preElement = document.createElement('pre');
        preElement.textContent = JSON.stringify(data, null, 2);
        responseDiv.appendChild(preElement);
        
    } catch (error) {
        responseDiv.innerHTML = `<span class="status error">Error: ${error.message}</span>`;
    }
}

// Function to handle POST /users form submission
async function handlePostUser(event) {
    event.preventDefault();
    const responseDiv = document.getElementById('postUserResponse');
    responseDiv.innerHTML = 'Loading...';
    
    try {
        // Get form values
        const userId = parseInt(document.getElementById('createUserId').value);
        const userName = document.getElementById('userName').value.trim();
        const userEmail = document.getElementById('userEmail').value.trim();
        const userItemsInput = document.getElementById('userItems').value.trim();
        
        // Validate and process items
        const userItems = userItemsInput
            .split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));

        if (userItems.length === 0) {
            throw new Error('Please enter valid item IDs');
        }

        // Create user object
        const userData = {
            id: userId,
            name: userName,
            email: userEmail,
            items: userItems
        };

        console.log('Sending user data:', userData); // Debug log

        // Send POST request
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        
        // Create status element
        const statusElement = document.createElement('span');
        statusElement.className = `status ${response.ok ? 'success' : 'error'}`;
        statusElement.textContent = `Status: ${response.status}`;
        
        // Display formatted response
        responseDiv.innerHTML = '';
        responseDiv.appendChild(statusElement);
        
        const preElement = document.createElement('pre');
        preElement.textContent = JSON.stringify(data, null, 2);
        responseDiv.appendChild(preElement);
        
    } catch (error) {
        responseDiv.innerHTML = `<span class="status error">Error: ${error.message}</span>`;
    }
}

// Function to update a user (PUT /users/:id)
async function updateUser(id, updates) {
    const responseDiv = document.getElementById('updateUserResponse');
    responseDiv.innerHTML = 'Loading...';
    
    try {
        console.log(`Updating user with ID ${id}:`, updates); // Debug log
        
        const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        
        const data = await response.json();
        
        // Create status element
        const statusElement = document.createElement('span');
        statusElement.className = `status ${response.ok ? 'success' : 'error'}`;
        statusElement.textContent = `Status: ${response.status}`;
        
        // Display formatted response
        responseDiv.innerHTML = '';
        responseDiv.appendChild(statusElement);
        
        const preElement = document.createElement('pre');
        preElement.textContent = JSON.stringify(data, null, 2);
        responseDiv.appendChild(preElement);
        
    } catch (error) {
        responseDiv.innerHTML = `<span class="status error">Error: ${error.message}</span>`;
    }
}

// Function to handle update user form submission
function handleUpdateUser(event) {
    event.preventDefault();
    
    try {
        // Get user ID
        const userId = parseInt(document.getElementById('updateUserId').value);
        if (isNaN(userId) || userId <= 0) {
            throw new Error('Please enter a valid user ID');
        }
        
        // Get optional form values
        const updates = {};
        
        const userName = document.getElementById('updateUserName').value.trim();
        if (userName) {
            updates.name = userName;
        }
        
        const userEmail = document.getElementById('updateUserEmail').value.trim();
        if (userEmail) {
            updates.email = userEmail;
        }
        
        const userItemsInput = document.getElementById('updateUserItems').value.trim();
        if (userItemsInput) {
            const userItems = userItemsInput
                .split(',')
                .map(id => parseInt(id.trim()))
                .filter(id => !isNaN(id));
                
            if (userItems.length > 0) {
                updates.items = userItems;
            }
        }
        
        // Check if any updates were provided
        if (Object.keys(updates).length === 0) {
            throw new Error('Please provide at least one field to update');
        }
        
        // Send the update request
        updateUser(userId, updates);
        
    } catch (error) {
        const responseDiv = document.getElementById('updateUserResponse');
        responseDiv.innerHTML = `<span class="status error">Error: ${error.message}</span>`;
    }
} 