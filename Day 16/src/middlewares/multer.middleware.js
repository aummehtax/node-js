    import multer from "multer"
    import crypto from "crypto";
    import path from "path"

    const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        
        // Generate random 16-byte hex string
        const randomName = crypto.randomBytes(16).toString("hex")
        
        //extract file extension (e.g .jpg, .png)
        const ext = path.extname(file.originalname)

        cb(null, `${randomName}${ext}`)
    }
    })

    export const upload = multer({ storage: storage })
