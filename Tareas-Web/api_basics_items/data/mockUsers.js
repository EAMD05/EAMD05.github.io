const mockUsers = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        items: [
            {
                id: 1,
                name: "Fire Sword",
                type: "Weapon",
                effect: "Fire damage +10"
            },
            {
                id: 2,
                name: "Ice Shield",
                type: "Defense",
                effect: "Defense +15, Ice resistance"
            }
        ]
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        items: [
            {
                id: 3,
                name: "Magic Wand",
                type: "Weapon",
                effect: "Magic power +20"
            }
        ]
    },
    {
        id: 3,
        name: "Bob Johnson",
        email: "bob@example.com",
        items: []
    }
];

export default mockUsers;
