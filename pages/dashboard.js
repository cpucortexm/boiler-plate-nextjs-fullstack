import { getSession, useSession } from 'next-auth/react'
import prisma from 'lib/prisma'
import { getJobsPosted, getUser, getApplications } from 'lib/data.js'
import Jobs from 'components/Jobs'
import Link from 'next/link'


export default function Dashboard({jobs, user, applications}) {
    const { data: session, status } = useSession()
 
    return (
        <div className='mt-10'>
            <div className='text-center p-4 m-4'>
                <h2 className='mb-10 text-4xl font-bold'>Dashboard</h2>
                    Dashboard

                {user.company && (
                    <span className='bg-black text-white uppercase text-sm p-2 '>
                        Company
                    </span>
                )}

                {session && (
                        <p className='mt-10 mb-10 text-2xl font-normal'>
                            {user.company ? 'all the jobs you posted' : 'your applications'}
                        </p>
                )}

            </div>
            {/* isDashboard is used because We can use this to tweak that component so that if */}
            { /* it’s the dashboard, we’ll also show if the job is published or unpublished*/}
            {/* display jobs if it’s a company, or the applications if it’s a regular user:*/}
            { user.company ? (
                 <Jobs jobs={jobs} isDashboard={true} />
                ) : (
                <>
                {applications.map((application) => {
                    return (
                    <div className='mb-4 mt-20 flex justify-center'>
                        <div className='pl-16 pr-16 -mt-6 w-1/2'>
                        <Link href={`/job/${application.job.id}`}>
                            <a className='text-xl font-bold underline'>
                            {application.job.title}
                            </a>
                        </Link>
                        <h2 className='text-base font-normal mt-3'>
                            {application.coverletter}
                        </h2>
                        </div>
                    </div>
                    )
                })}
                </>
            )}
        </div>
    )
}

// read from /lib/data.js to display on the dashboard
export async function getServerSideProps(context) {
    const session = await getSession(context)

    let user = await getUser(session.user.id, prisma)
    user = JSON.parse(JSON.stringify(user))

    let jobs = []
    let applications = []


    if (user.company) {
        // list the jobs posted by a company
        jobs = await getJobsPosted(user.id, prisma)
        jobs = JSON.parse(JSON.stringify(jobs))
    } else {
        // get all candidate applications to display to the dashboard
        applications = await getApplications(user.id, prisma)
        applications = JSON.parse(JSON.stringify(applications))
    }
    return {
        props: {
            jobs,
            user,
            applications,
        },
    }
}