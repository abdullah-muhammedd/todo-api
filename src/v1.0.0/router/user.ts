/**
 * ~ User Router.
 * Contains routes for user-related operations like getting user data and updating user information.
 *
 * @module routes/user
 */

import { Router } from 'express';
import * as userController from '../controller/user';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

/**
 * ~ Route for getting user data.
 *
 * @name GET /users
 * @function
 * @memberof module:routes/user
 * @inner
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for the route.
 * @param {Function} handler - Request handler function for the route.
 * @throws {AuthError} Throws an `AuthError` if the user is not authenticated.
 * @returns {void}
 */
router.get('/users', isAuthenticated, userController.getUser);

/**
 * ~ Route for updating user data.
 *
 * @name PATCH /users
 * @function
 * @memberof module:routes/user
 * @inner
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for the route.
 * @param {Function} handler - Request handler function for the route.
 * @throws {ValidationError} Throws a `ValidationError` if the provided user data is invalid.
 * @throws {AuthError} Throws an `AuthError` if the user is not authenticated.
 * @returns {void}
 */
router.patch('/users', isAuthenticated, userController.patchUserData);

/**
 * ~ Route for updating user password.
 *
 * @name PATCH /users/password-reset
 * @function
 * @memberof module:routes/user
 * @inner
 * @param {string} path - Express route path.
 * @param {Function[]} middleware - Middleware functions for the route.
 * @param {Function} handler - Request handler function for the route.
 * @throws {ValidationError} Throws a `ValidationError` if the provided password data is invalid.
 * @throws {AuthError} Throws an `AuthError` if the user is not authenticated.
 * @returns {void}
 */
router.patch('/users/password-reset', isAuthenticated, userController.patchUserPassword);

export default router;
