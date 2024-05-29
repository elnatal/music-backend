import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    let fileExt = file.originalname.split(".").pop();

    // generate new file name
    const fileName = `${new Date().getTime()}.${fileExt}`;

    cb(null, fileName);
  },
});

export const uploadFile = multer({ storage: storage });
