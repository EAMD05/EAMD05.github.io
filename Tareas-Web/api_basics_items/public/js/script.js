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

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', getItems); 