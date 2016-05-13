var config = {}

// SF API Configurations
config.sf               = {}
config.sf.client_id     = process.env.CLIENT_ID_SF
config.sf.client_secret = process.env.CLIENT_SECRET_SF
config.sf.redirect_uri  = process.env.REDIRECT_URI_SF
config.sf.environment   = process.env.ENVIRONMENT_SF
config.sf.username      = process.env.USERNAME_SF
config.sf.password      = process.env.PASSWORD_SF

// General Configurations
config.cookie_security  = false
config.port             = process.env.PORT
config.mongoUrl         = process.env.MONGOLAB_URI
config.mysql_connection = {
  host: process.env.MYSQL_URL,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB
}

config.scsspath         = process.env.SCSS_PATH
config.cssout           = process.env.CSS_OUT

module.exports = config
