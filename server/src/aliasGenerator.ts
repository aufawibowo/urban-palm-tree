// simple combinatorial alias  ✨ add more items for uniqueness
const animals = ['Komodo', 'Orangutan', 'Tiger', 'Cendrawasih', 'Gajah'];
const cities  = ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Makassar'];

function pick(list: string[]) {
    return list[Math.floor(Math.random() * list.length)];
}

export function randomAlias() {
    return `${pick(animals)}-${pick(cities)}`; // e.g. Tiger-Jakarta
}
