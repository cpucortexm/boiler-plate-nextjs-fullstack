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

    // We have to use a return because it is a promise
        /*
            jobs.map(async(job) =>{
                return job.applications = await getApplications(job, prisma)
            })
        */
    // Instead of the above code, we can use a short form, as below

    // We return all the promises (it has an implicit return)
    // basically we are waiting for all the promises to return to - all,
    // before returning the jobs
    await Promise.all(
        jobs.map(
        async (job) => (job.applications = await getJobApplications(job, prisma))
        )
    )
    // before returning the jobs, we are also attaching to each job the 
    // applied candidates
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

// give us the user’s job applications data:
export const getApplications = async (user_id, prisma) => {
    const applications = await prisma.application.findMany({
        where: { authorId: user_id },
        orderBy: [
        {
            id: 'desc',
        },
        ],
        include: {
            author: true,
            job: true,
        },
    })

    return applications
}


export const alreadyApplied = async (user_id, job_id, prisma) => {
    const applications = await prisma.application.findMany({
        where: {
            authorId: user_id,
            jobId: parseInt(job_id),
        },
        include: {
            author: true,
        },
    })

    if (applications.length > 0) {
        return true
    }

    return false
}

// returns all the applications(candidates) for a given job Id.
// This is needed to add to each job its own list of applicants
// This is internal to data.js and hence not exported
const getJobApplications = async (job, prisma) => {
    const applications = await prisma.application.findMany({
        where: { jobId: job.id },
        orderBy: [
        {
            id: 'desc',
        },
        ],
        include: {
        author: true,
        job: true,
    },
    })

    return applications
}