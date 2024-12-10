import { PrismaClient } from '@prisma/client'
import {faker} from '@faker-js/faker'

const prisma = new PrismaClient()
async function main() {
    for (let i = 0; i < 50; i++) {
        await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                price: faker.number.int({min: 100, max: 30000}),
                quantity: faker.number.int({min: 0, max: 300}),
                description: faker.commerce.productDescription()
            }
        })
    }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })