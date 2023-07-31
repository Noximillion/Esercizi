import express from "express";
import "express-async-errors";
import morgan from "morgan";
import Joi from "joi";
import {
    getAll,
    getOneById,
    create,
    updateById,
    deleteById,
    addImage,
} from "./planets";
import multer from "multer"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage})

const app = express();
app.use(express.json());

const port = 3000;

app.use(morgan("dev"));

app.get("/api/planets", getAll);

app.get("/api/planets/:id", getOneById);

app.post("/api/planets", create);

app.put("/api/planets/:id", updateById);

app.delete("/api/planets/:id", deleteById);

app.post("/api/planets:id/image", upload.single('image'), addImage);

app.listen(port, () => {
    console.log(`this is an example of a server on port: ${port}`);
});
