import monggose from 'mongoose'

const Schema = monggose.Schema
const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  }
})

export default monggose.model('User', UserSchema)

// 模型
