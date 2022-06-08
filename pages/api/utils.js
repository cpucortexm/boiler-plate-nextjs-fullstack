// handles the api routes for
//1.  clean_database
//2.  Generate 10 users and some jobs
//3.  generate 1 new job 

import prisma from 'lib/prisma'
import { faker } from '@faker-js/faker'


const generateFakeJob = (user) => ({
    title: faker.company.catchPhrase(),
    description: faker.lorem.paragraphs(),
    author: {
        connect: { id: user.id },
    },
})

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.end()

    // handle clean database
    if (req.body.task === 'clean_database') {
        await prisma.job.deleteMany({})
        await prisma.user.deleteMany({})
    }

    // handle generate 10 users and some jobs
    if (req.body.task === 'generate_users_and_jobs'){
        let count = 0

        // add some users that are companies, some users that are not.
        // while loop for 10 users
        while (count < 10) {
            await prisma.user.create({
                data: {
                    name: faker.internet.userName().toLowerCase(),
                    email: faker.internet.email().toLowerCase(),
                    company: faker.datatype.boolean(), // some will be true and some false
                },
            })

            count++
        }

         //create 1 job for each user that's a company
         // first get all the users that is a company
        const users = await prisma.user.findMany({
            where: {
                company: true,
            },
        })
        // loop over the users to generate a fake job
        users.forEach(async (user) => {
            await prisma.job.create({
                data: generateFakeJob(user),
            })
        })
    }

    // handle generate 1 new job (we choose first company here i.e. [0])
    if (req.body.task === 'generate_one_job'){

        const users = await prisma.user.findMany({
        where: {
            company: true, // only company can create a new job
        },
        })

        await prisma.job.create({
            data: generateFakeJob(users[0]),
        })
    }


    res.end()
}