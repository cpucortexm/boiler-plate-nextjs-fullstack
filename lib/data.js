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

// getCompany by doing findUnique() request to the prisma.user model
export const getCompany = async (company_id, prisma) => {

    const user = await prisma.user.findUnique({
        where: {
            id: company_id,
        },
    })
    return user  
}

// getting the jobs whose author is equal to the company_id parameter we pass
export const getCompanyJobs = async (company_id, prisma) => {
    const jobs = await prisma.job.findMany({
        where: { authorId: company_id, published: true },
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

// get a user data from its id
export const getUser = async (id, prisma) => {
    const user = await prisma.user.findUnique({
        where: {
        id,
        },
    })

    return user
}