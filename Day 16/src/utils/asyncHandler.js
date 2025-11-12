const asyncHandler = (requestHandler) => {
   return (req, res, next) => {
     Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
   }
}

export {asyncHandler}

// 📘 asyncHandler function:
// This is a helper function that makes async code cleaner.
// Normally, in Express, you must write try-catch in every route for async errors.
// asyncHandler does that automatically.
//
// 🔹 How it works:
// - It takes a function (requestHandler) that handles the route.
// - It runs that function inside Promise.resolve().
// - If any error happens, it catches it and passes it to Express’s `next()` function.
// - Express then forwards that error to your error-handling middleware.
//
// ✅ In short: No need to write try-catch in every async route anymore!
