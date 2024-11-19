// src/scripts/test-db.ts
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function testConnection() {
  try {
    console.log('Testing database connection...')
    const result = await prisma.$queryRaw`SELECT current_database()`
    console.log('Connection successful:', result)
    return result
  } catch (error) {
    console.error('Connection error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
  .catch((error) => {
    console.error('Test failed:', error)
    process.exit(1)
  })