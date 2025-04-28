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