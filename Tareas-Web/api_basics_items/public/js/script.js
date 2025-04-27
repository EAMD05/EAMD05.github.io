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

    // Prueba para POST /items
    const itemsToAdd = [];
    const itemForm = document.querySelector('.item-form');
    const itemsList = document.getElementById('items-to-add');
    const testPostItemsButton = document.getElementById('test-post-items');
    const postItemsResult = document.getElementById('POST-api-items-result');

    // Función para agregar un item a la lista
    function addItemToList(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-card';
        itemElement.innerHTML = `
            <div class="item-info">
                <strong>ID:</strong> ${item.id}<br>
                <strong>Nombre:</strong> ${item.name}<br>
                <strong>Tipo:</strong> ${item.type}<br>
                <strong>Efecto:</strong> ${item.effect}
            </div>
            <button class="remove-item" data-id="${item.id}">Eliminar</button>
        `;
        itemsList.appendChild(itemElement);

        // Agregar evento para eliminar el item
        itemElement.querySelector('.remove-item').addEventListener('click', () => {
            const index = itemsToAdd.findIndex(i => i.id === item.id);
            if (index !== -1) {
                itemsToAdd.splice(index, 1);
                itemElement.remove();
            }
        });
    }

    // Evento para agregar un nuevo item
    document.getElementById('add-item').addEventListener('click', () => {
        const id = document.getElementById('item-id').value;
        const name = document.getElementById('item-name').value;
        const type = document.getElementById('item-type').value;
        const effect = document.getElementById('item-effect').value;

        if (!id || !name || !type || !effect) {
            alert('Por favor, completa todos los campos');
            return;
        }

        const newItem = {
            id: parseInt(id),
            name,
            type,
            effect
        };

        // Verificar si el ID ya existe en la lista
        if (itemsToAdd.some(item => item.id === newItem.id)) {
            alert('Ya existe un item con este ID en la lista');
            return;
        }

        itemsToAdd.push(newItem);
        addItemToList(newItem);

        // Limpiar el formulario
        itemForm.reset();
    });

    // Evento para probar POST /items
    testPostItemsButton.addEventListener('click', async () => {
        if (itemsToAdd.length === 0) {
            postItemsResult.textContent = 'Por favor, agrega al menos un item';
            return;
        }

        try {
            const response = await fetch('/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemsToAdd)
            });
            
            const data = await response.json();
            postItemsResult.textContent = JSON.stringify(data, null, 2);
            console.log('POST /items response:', data);

            // Limpiar la lista después de una respuesta exitosa
            if (response.status === 201) {
                itemsToAdd.length = 0;
                itemsList.innerHTML = '';
            }
        } catch (error) {
            postItemsResult.textContent = `Error: ${error.message}`;
            console.error('POST /items error:', error);
        }
    });

    // Prueba para PUT /items/:id
    const testPutItemButton = document.getElementById('test-put-item');
    const putItemsResult = document.getElementById('PUT-api-items-result');

    testPutItemButton.addEventListener('click', async () => {
        const itemId = document.getElementById('update-item-id').value;
        const name = document.getElementById('update-item-name').value;
        const type = document.getElementById('update-item-type').value;
        const effect = document.getElementById('update-item-effect').value;

        if (!itemId) {
            putItemsResult.textContent = 'Por favor, ingresa un ID válido';
            return;
        }

        // Crear objeto con solo los campos que tienen valor
        const updates = {};
        if (name) updates.name = name;
        if (type) updates.type = type;
        if (effect) updates.effect = effect;

        if (Object.keys(updates).length === 0) {
            putItemsResult.textContent = 'Por favor, ingresa al menos un campo para actualizar';
            return;
        }

        try {
            const response = await fetch(`/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            
            const data = await response.json();
            putItemsResult.textContent = JSON.stringify(data, null, 2);
            console.log(`PUT /items/${itemId} response:`, data);
        } catch (error) {
            putItemsResult.textContent = `Error: ${error.message}`;
            console.error(`PUT /items/${itemId} error:`, error);
        }
    });
}); 