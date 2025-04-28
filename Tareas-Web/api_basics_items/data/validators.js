export function validateItem(item) {
    // Check if all required fields are present
    if (!item.id || !item.name || !item.type || !item.effect) {
        return { isValid: false, message: "Missing required fields" };
    }

    // Check if id is a number
    if (typeof item.id !== 'number') {
        return { isValid: false, message: "ID must be a number" };
    }

    // Check if other fields are strings
    if (typeof item.name !== 'string' || typeof item.type !== 'string' || typeof item.effect !== 'string') {
        return { isValid: false, message: "Name, type, and effect must be strings" };
    }

    return { isValid: true };
}

export function isDuplicate(items, newItem) {
    return items.some(item => item.id === newItem.id);
}

// User validation functions
export function validateUser(user) {
    // Try to convert id to number
    let userId = user.id;
    if (typeof userId === 'string') {
        userId = parseInt(userId.trim());
    }
    if (!userId || isNaN(userId)) {
        console.log('Invalid or missing id:', user.id);
        return { isValid: false, message: "Incomplete data or item does not exist" };
    }

    // Validate name
    if (!user.name || typeof user.name !== 'string' || user.name.trim() === '') {
        console.log('Invalid or missing name:', user.name);
        return { isValid: false, message: "Incomplete data or item does not exist" };
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email || !emailRegex.test(user.email)) {
        console.log('Invalid or missing email:', user.email);
        return { isValid: false, message: "Incomplete data or item does not exist" };
    }

    // Convert items to array of numbers if it's a string
    let itemsArray = user.items;
    if (typeof itemsArray === 'string') {
        itemsArray = itemsArray.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    }
    if (!Array.isArray(itemsArray) || itemsArray.length === 0) {
        console.log('Invalid or missing items:', user.items);
        return { isValid: false, message: "Incomplete data or item does not exist" };
    }
    if (itemsArray.some(id => isNaN(id))) {
        console.log('Invalid item IDs:', itemsArray);
        return { isValid: false, message: "Incomplete data or item does not exist" };
    }

    // If all validations pass, update the user object with parsed values
    user.id = userId;
    user.items = itemsArray;

    return { isValid: true };
}

export function isDuplicateUser(users, newUser) {
    // Ensure both IDs are numbers for comparison
    const newUserId = typeof newUser.id === 'string' ? parseInt(newUser.id) : newUser.id;
    return users.some(user => {
        const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
        return userId === newUserId;
    });
}

export function validateUserItems(items, userItems) {
    return userItems.every(itemId => items.some(item => item.id === itemId));
} 