export default {
  dbs: 'mongodb://127.0.0.1:27017/student',
  redis: {
    get host() {
      return '127.0.0.1'
    },
    get port() {
      return 6379
    }
  },
  smtp: {
    get host() {
      return 'stmp.qq.com'
    },
    get user() {
      return '1069267500@qq.com'
    },
    get pass() {
      return 'exabxiqabvudbejb'
    }
  },
  get code() {
    return () => {
      return Math.random().toString().slice(2, 6).toUpperCase()
    }
  },
  get expire() {
    return () => {
      return new Date().getTime() + 60 * 60 * 1000
    }
  }

}

// dbs student是数据库名称

// 开启 STMP  服务
// 1. QQ邮箱 ->
// 2. 设置 ->
// 3. POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务
// 4. 开启 POP3/STMP  和  IMAP/STMP 服务
// exabxiqabvudbejb  pgbsjqqbovjabddi  cugihmkbifmybdag
