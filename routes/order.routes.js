import express from 'express';
import {
  addToCart,
  getCart,
  checkoutWithStripe,
  clearCart,
  handleSuccess,
  getAllOrders,
} from '../controllers/order.controller.js';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication.js';

const router = express.Router();

router.route('/').get([authenticatedUser], getAllOrders);
router
  .route('/cart')
  .post([authenticatedUser], addToCart)
  .get([authenticatedUser], getCart);
router.route('/checkout').post([authenticatedUser], checkoutWithStripe);
router.route('/success').get([authenticatedUser], handleSuccess);
router.route('/clear').delete([authenticatedUser], clearCart);

export default router;
