class apiError extends Error{
    constructor(statusCode, message= "something went wrong!", errors= [], stack = "") {
        super(message) //call parent constructor
        this.statusCode = statusCode
        this.message = message
        this.data = null
        this.errors = errors

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {apiError}

// 📘 apiError class:
// This custom class extends the built-in Error class to create more useful error messages.
// It helps us handle errors in a clean and structured way in backend.
//
// 🔹 How it works:
// - `super(message)` calls the main Error class constructor so the message gets stored properly.
// - `statusCode` → tells what type of error (e.g. 404, 500, 401).
// - `message` → short description of what went wrong.
// - `errors` → can hold multiple specific errors (like validation errors).
// - `data` → optional field for extra info (here it's null).
//
// 🔹 Stack handling:
// - If `stack` (error trace) is already given, use it.
// - Else, `Error.captureStackTrace()` creates a clean trace showing where the error happened.
//
// ✅ In short:
// This class helps you send neat, detailed, and consistent error responses in your APIs.
