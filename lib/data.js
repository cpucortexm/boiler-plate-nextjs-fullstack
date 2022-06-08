import prisma from 'lib/prisma'

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