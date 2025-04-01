const { uploadSingleFile, uploadMultipleFiles } = require('../services/fileService')

const postUploadSingleFileApi = async (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let result = await uploadSingleFile(req.files.image);

    return res.status(200).json(
        {
            EC: 0,
            data: result
        }
    )
}

const postUploadMultipleFile = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.')
    }
    if (Array.isArray(req.files.profilePicture)) {
        //upload multiple
        let result = await uploadMultipleFiles(req.files.profilePicture)
        res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    } else {
        //upload single
        return await postUploadSingleFileApi(req, res)
    }
}

module.exports = {
    postUploadSingleFileApi, postUploadMultipleFile
}