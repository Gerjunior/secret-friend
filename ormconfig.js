const base_directory = process.env.BASE_DIR || 'src'
const file_extension = process.env.FILE_EXTENSION || 'ts'

module.exports = {
  "url": process.env.DATABASE_URL,
  "type": "postgres",
  "entities": [
    `./${base_directory}/modules/users/infra/typeorm/entities/*.${file_extension}`,
    `./${base_directory}/modules/groups/infra/typeorm/entities/*.${file_extension}`
  ],
  "migrations": [
    `./${base_directory}/shared/infra/typeorm/migrations/*.${file_extension}`
  ],
  "cli": {
    "migrationsDir": "./src/shared/infra/typeorm/migrations"
  }
}
