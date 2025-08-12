// Import all models to ensure they are registered
import './User';
import './Product';
import './Message';
import './Order';
import './Wishlist';

// Re-export for convenience
export { default as User } from './User';
export { default as Product } from './Product';
export { default as Message } from './Message';
export { default as Order } from './Order';
export { default as Wishlist } from './Wishlist';
