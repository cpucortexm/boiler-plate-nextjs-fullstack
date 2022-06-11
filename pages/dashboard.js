import { getSession, useSession } from 'next-auth/react'
import prisma from 'lib/prisma'
import { getJobsPosted, getUser } from 'lib/data.js'
import Jobs from 'components/Jobs'


export default function Dashboard({jobs, user}) {
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
                <>
                  {user.company && (
                    <p className='mt-10 mb-10 text-2xl font-normal'>
                        all the jobs you posted
                    </p>
                  )}
                </>            
            )}
        </div>
        {/* isDashboard is used because We can use this to tweak that component so that if */}
        { /* it’s the dashboard, we’ll also show if the job is published or unpublished*/}
            <Jobs jobs={jobs} isDashboard={true} /> 
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    let user = await getUser(session.user.id, prisma)
        user = JSON.parse(JSON.stringify(user))

    let jobs = await getJobsPosted(user.id, prisma) // dashboard
        jobs = JSON.parse(JSON.stringify(jobs))

    return {
        props: {
        jobs,
        user,
        },
    }
}