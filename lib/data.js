import prisma from 'lib/prisma'

// gives only jobs where it is published and author is set
export const getJobs = async (prisma) => {
    const jobs = await prisma.job.findMany({
        where: {
        published: true
        },
        orderBy: [
        {
            id: 'desc',
        },
        ],
        include: {
        author: true,
        },
    })

    return jobs
}


//  get the job details by querying the database using id
export const getJob = async (id, prisma) => {
    const job = await prisma.job.findUnique({
        where: {
        id: parseInt(id),
        },
        include: {
        author: true,
        },
    })

    return job
}