// Función para mostrar resultados en la consola y en la página
function logResult(result) {
    console.log('\n=== Resultado de GET /api/items ===');
    console.log(result);
    
    // Mostrar en la página
    const resultElement = document.getElementById('GET-api-items-result');
    if (resultElement) {
        resultElement.textContent = JSON.stringify(result, null, 2);
    }
}

// Función para manejar errores
function handleError(error) {
    console.error('Error en GET /api/items:', error);
    const resultElement = document.getElementById('GET-api-items-result');
    if (resultElement) {
        resultElement.textContent = `Error: ${error.message}`;
    }
}

// Función para probar GET /api/items
async function testGetItems() {
    try {
        console.log('Probando GET /api/items...');
        const response = await fetch('/api/items');
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
    // Prueba para GET /items
    const testGetItemsButton = document.getElementById('test-get-items');
    const getItemsResult = document.getElementById('GET-api-items-result');

    testGetItemsButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/items');
            const data = await response.json();
            getItemsResult.textContent = JSON.stringify(data, null, 2);
            console.log('GET /items response:', data);
        } catch (error) {
            getItemsResult.textContent = `Error: ${error.message}`;
            console.error('GET /items error:', error);
        }
    });

    // Prueba para GET /items/:id
    const testGetItemByIdButton = document.getElementById('test-get-item-by-id');
    const itemIdInput = document.getElementById('item-id-input');
    const getItemByIdResult = document.getElementById('GET-api-items-id-result');

    testGetItemByIdButton.addEventListener('click', async () => {
        const itemId = itemIdInput.value;
        if (!itemId) {
            getItemByIdResult.textContent = 'Por favor, ingresa un ID válido';
            return;
        }

        try {
            const response = await fetch(`/items/${itemId}`);
            const data = await response.json();
            getItemByIdResult.textContent = JSON.stringify(data, null, 2);
            console.log(`GET /items/${itemId} response:`, data);
        } catch (error) {
            getItemByIdResult.textContent = `Error: ${error.message}`;
            console.error(`GET /items/${itemId} error:`, error);
        }
    });
}); 