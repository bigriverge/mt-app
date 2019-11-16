import mongoose from 'mongoose'
const Schema = mongoose.Schema

const Poi = new Schema({
  name: {
    type: String
  },
  province: {
    type: String
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  areaCode: {
    type: String
  },
  tel: {
    type: String
  },
  area: {
    type: String
  },
  addr: {
    type: String
  },
  type: {
    type: String
  },
  module: {
    type: String
  },
  longitude: {
    type: Number //经度
  },
  latitude: {
    type: Number //纬度
  }
})

export default mongoose.model('Poi', Poi)
