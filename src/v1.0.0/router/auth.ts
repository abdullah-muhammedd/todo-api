/**
 * ~ Authentication Router.
 * Contains routes for user signup and login.
 *
 * @module routes/auth
 */

import { Router } from 'express';
import * as authController from '../controller/auth';
import { isNotAuthenticated } from '../middleware/auth';

const router = Router();

/**
 * ~ Route for user signup.
 *
 * @name POST /signup
 * @function
 * @memberof module:routes/auth
 * @inner
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for the route.
 * @param {Function} handler - Request handler function for the route.
 * @throws {AuthError} Throws an `AuthError` if the user is already authenticated.
 * @returns {void}
 */
router.post('/signup', isNotAuthenticated, authController.postSignUp);

/**
 * ~ Route for user login.
 *
 * @name POST /login
 * @function
 * @memberof module:routes/auth
 * @inner
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for the route.
 * @param {Function} handler - Request handler function for the route.
 * @throws {AuthError} Throws an `AuthError` if the user is already authenticated.
 * @returns {void}
 */
router.post('/login', isNotAuthenticated, authController.postLogin);

export default router;
