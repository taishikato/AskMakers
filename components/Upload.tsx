import React from 'react'
import { Upload, Icon, message } from 'antd'
import { NextPage } from 'next'

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M;
}

const Uplaod: NextPage<Props> = props => {
  const { label, handleChange, imageUrl, isLoading } = props

  const uploadButton = (
    <div>
      <Icon type={isLoading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  )

  return (
    <>
      <label className="font-semibold block mb-2">{label}</label>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    </>
  )
}

interface Props {
  label: string,
  imageUrl: string,
  isLoading: boolean,
  handleChange: any
}

export default Uplaod
