/***
 * An array of public routes
 * These routes are accessible without authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
    

]

/***
 * An array that contains all the routes that require authentication
 * These routes will redirect logged in users to the Dashboard Page 
 * @type {string[]}
 */
export const authRoutes = [
    "/login",
    "/sign-in",
    "/sign-up",
    "/error",
    "/reset",
    "/new-password",
    "/new-verification"
]

/***
 * The prefix route for API authentication routes
 * Routes that starts with this Prefix are used for API Authentication purposes.
 * @type {string}
 */
export const apiPrefixRoutes = "/api/auth"


/***
 * The default route that users will be redirected to after successful authentication
 * @type {string}
 */
export const DEFAULT_REDIRECT_ROUTES = "/dashboard"