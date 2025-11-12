class apiResponse{
    constructor(statusCode, data, message = "success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export {apiResponse}

// 📘 apiResponse class:
// This class is used to send a clean and consistent response from the backend to the frontend.
//
// 🔹 How it works:
// - `statusCode` → shows if the request was successful (like 200, 201, 404, 500).
// - `data` → contains the actual response data you want to send (like user info, post list, etc).
// - `message` → short text saying what happened (default is "success").
// - `success` → automatically true if statusCode < 400 (means no error).
//
// ✅ In short:
// This class helps to keep all API responses in the same format — easy to read, easy to handle on frontend.
