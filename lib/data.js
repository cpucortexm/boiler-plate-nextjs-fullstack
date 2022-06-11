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
// This endpoint only returns published jobs (this does not give unpublished jobs)
// thus published = true
// called from company/[id].js
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

// this gives list of all the jobs (published + unpublished)
// companies can unpublish a job, for example after they received enough candidates, 
// and they will still be able to see it in their dashboard, but people will not see
//  it in the database any more.
// called from dashboard.js
export const getJobsPosted = async (user_id, prisma) => {
    const jobs = await prisma.job.findMany({
        where: { authorId: user_id },
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