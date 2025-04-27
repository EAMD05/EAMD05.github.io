const mockUsers = [
    {
        id: 1,
        name: "Juan Pérez",
        email: "juan@example.com",
        items: [
            {
                id: 1,
                name: "Espada de Fuego",
                type: "Arma",
                effect: "Daño de fuego +10"
            },
            {
                id: 2,
                name: "Escudo de Hielo",
                type: "Defensa",
                effect: "Defensa +15, Resistencia al hielo"
            }
        ]
    },
    {
        id: 2,
        name: "María García",
        email: "maria@example.com",
        items: [
            {
                id: 3,
                name: "Varita Mágica",
                type: "Arma",
                effect: "Poder mágico +20"
            }
        ]
    },
    {
        id: 3,
        name: "Carlos López",
        email: "carlos@example.com",
        items: []
    }
];

export default mockUsers;
