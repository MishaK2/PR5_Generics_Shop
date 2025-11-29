// -----------------------------
// Крок 1. Типи для товарів
// -----------------------------

export type BaseProduct = {
    id: number;
    name: string;
    price: number;
    description?: string;
};

export type Electronics = BaseProduct & {
    category: "electronics";
    warrantyMonths: number;
};

export type Clothing = BaseProduct & {
    category: "clothing";
    size: string;
    material: string;
};

export type Book = BaseProduct & {
    category: "book";
    author: string;
    pages: number;
};

// -----------------------------
// Крок 2. Генеричні функції
// -----------------------------

export const findProduct = <T extends BaseProduct>(
    products: T[],
    id: number
): T | undefined => {
    if (!Array.isArray(products)) {
        throw new Error("Очікується масив товарів");
    }

    return products.find((p) => p.id === id);
};

export const filterByPrice = <T extends BaseProduct>(
    products: T[],
    maxPrice: number
): T[] => {
    if (maxPrice < 0) {
        throw new Error("Ціна не може бути негативною");
    }

    return products.filter((p) => p.price <= maxPrice);
};

// -----------------------------
// Крок 3. Робота з кошиком
// -----------------------------

export type CartItem<T> = {
    product: T;
    quantity: number;
};

export const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T | undefined,
    quantity: number
): CartItem<T>[] => {
    if (!product) {
        throw new Error("Товар не знайдено");
    }

    if (quantity <= 0) {
        throw new Error("Кількість повинна бути більшою за 0");
    }

    const existing = cart.find((item) => item.product.id === product.id);

    if (existing) {
        return cart.map((item) =>
            item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
        );
    }

    return [...cart, { product, quantity }];
};

export const calculateTotal = <T extends BaseProduct>(
    cart: CartItem<T>[]
): number => {
    return cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
};

// -----------------------------
// Крок 4. Демонстрація роботи
// -----------------------------

const electronics: Electronics[] = [
    {
        id: 1,
        name: "Смартфон Xiaomi",
        price: 10000,
        category: "electronics",
        warrantyMonths: 12
    },
    {
        id: 2,
        name: "Ноутбук Lenovo",
        price: 32000,
        category: "electronics",
        warrantyMonths: 24
    }
];

const clothes: Clothing[] = [
    {
        id: 3,
        name: "Куртка зимова",
        price: 4500,
        category: "clothing",
        size: "L",
        material: "Polyester"
    }
];

const books: Book[] = [
    {
        id: 4,
        name: "Clean Code",
        price: 900,
        category: "book",
        author: "Robert C. Martin",
        pages: 464
    }
];

// Тестування
const phone = findProduct(electronics, 1);
console.log("Знайдений товар:", phone);

const cheap = filterByPrice([...electronics, ...books], 5000);
console.log("Фільтрація за ціною:", cheap);

let cart: CartItem<BaseProduct>[] = [];
cart = addToCart(cart, phone, 1);
cart = addToCart(cart, books[0], 2);

console.log("Кошик:", cart);
console.log("Загальна сума:", calculateTotal(cart));
