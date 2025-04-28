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