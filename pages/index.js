import prisma from 'lib/prisma'
import { getJobs } from 'lib/data.js'
import Jobs from 'components/Jobs'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

// iterate on the jobs array and print the jobs details:
// create a job component
export default function Home({jobs}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // session is set, but user name is not available
  if (session && !session.user.name) {
    router.push('/setup')
  }

  return (
    <div className='mt-10'>
      <div className='text-center p-4 m-4'>
        <h2 className='mb-10 text-4xl font-bold'>Find a job!</h2>
      </div>
      {!session && (
        <a className='border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black '
          href='/api/auth/signin'>
          login
        </a>
      )}

      <Jobs jobs={jobs}/>
    </div>
  )
}


export async function getServerSideProps(context) {
    let jobs = await getJobs(prisma)
    jobs = JSON.parse(JSON.stringify(jobs))
    return {
        props: {
          jobs,
        },
    }
}
