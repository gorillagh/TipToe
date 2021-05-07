import React from 'react'
import Resizer from 'react-image-file-resizer'
import { uploadImages, removeImage } from '../../serverFunctions/cloudinary'
import { useSelector } from 'react-redux'
import { LoadingOutlined } from '@ant-design/icons'
import { Avatar, Badge } from 'antd'

const FileUpload = ({ values, setValues, imageLoading, setImageLoading }) => {
  //Redux State
  const { user } = useSelector((state) => ({ ...state }))

  const fileResizeAndUpload = (e) => {
    let files = e.target.files
    let allUploads = values.images

    if (files) {
      setImageLoading(true)

      for (let i = 0; i < files.length; i++) {
        //Edit pics and upload to Cloudinary
        Resizer.imageFileResizer(
          files[i],
          640,
          640,
          'JPEG',
          100,
          0,
          (uri) => {
            uploadImages(user.token, uri)
              .then((res) => {
                // console.log('Image Upload Res Data', res)
                if (i === files.length - 1) setImageLoading(false)
                allUploads.push(res.data)

                setValues({ ...values, images: allUploads })
              })
              .catch((err) => {
                setImageLoading(false)
                console.log('Cloudinary upload error', err)
              })
          },
          'base64'
        )
      }

      console.log(values.images)
    }
  }

  return (
    <>
      <div className='text-center'>
        <label
          className={
            imageLoading
              ? 'btn btn-secondary btn-raised btn-sm'
              : 'btn btn-dark btn-raised btn-sm'
          }
        >
          {imageLoading && <LoadingOutlined />} Select Images
          <input
            type='file'
            multiple
            hidden
            accept='image/*'
            onChange={fileResizeAndUpload}
            disabled={imageLoading}
          />
        </label>
      </div>
      <div className='row mt-3'>
        {values.images &&
          values.images.map((image) => (
            <Badge
              key={image.public_id}
              count='X'
              className='mr-3'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                removeImage(user.token, image.public_id)
                  .then((res) => console.log(res.data))
                  .catch((err) => console.log(err.data.success, err.data.err))
                let filteredImages = values.images.filter(
                  (fImage) => fImage.public_id !== image.public_id
                )
                setValues({ ...values, images: filteredImages })
              }}
            >
              <Avatar src={image.url} size={80} shape='square' />
            </Badge>
          ))}
      </div>
    </>
  )
}

export default FileUpload
