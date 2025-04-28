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

// Función para probar el endpoint GET /items
async function getItems() {
    const responseDiv = document.getElementById('itemsResponse');
    responseDiv.innerHTML = 'Cargando...';
    
    try {
        const response = await fetch('http://localhost:3000/items');
        const data = await response.json();
        
        // Crear elemento de estado
        const statusElement = document.createElement('span');
        statusElement.className = `status ${response.ok ? 'success' : 'error'}`;
        statusElement.textContent = `Status: ${response.status}`;
        
        // Mostrar la respuesta formateada
        responseDiv.innerHTML = '';
        responseDiv.appendChild(statusElement);
        
        const preElement = document.createElement('pre');
        preElement.textContent = JSON.stringify(data, null, 2);
        responseDiv.appendChild(preElement);
        
    } catch (error) {
        responseDiv.innerHTML = `<span class="status error">Error: ${error.message}</span>`;
    }
}

// Llamar a la función cuando se cargue la página
document.addEventListener('DOMContentLoaded', getItems); 