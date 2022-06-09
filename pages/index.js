import prisma from 'lib/prisma'
import { getJobs,getUser } from 'lib/data.js'
import Jobs from 'components/Jobs'
import { useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

// iterate on the jobs array and print the jobs details:
// create a job component
export default function Home({jobs, user}) {
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
        <Link href="/api/auth/signin">
         <a className='border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black '>
          login
        </a>
        </Link>
      )}

      {session && (
        <>
          <p className='mb-10 text-2xl font-normal'>
            Welcome, {user.name}
            {user.company && (
              <span className='bg-black text-white uppercase text-sm p-2'>
                Company
              </span>
            )}
          </p>
          {user.company ? (
            <>
              <button
                className='border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black '
              >
                click here to post a new job
              </button>
              <button
                className='ml-5 border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black '
              >
                see all the jobs you posted
              </button>
            </>
          ) : (
            <>
              <button
                className='ml-5 border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black '
              >
                see all the jobs you applied to
              </button>
            </>
          )}
        </>
      )}
      <Jobs jobs={jobs}/>
    </div>
  )
}


export async function getServerSideProps(context) {

    let jobs = await getJobs(prisma)
    jobs = JSON.parse(JSON.stringify(jobs))

    const session = await getSession(context)
    if(!session){
      return{
        props: {
          jobs,
        }
      }
    }
    let user = await getUser(session.user.id, prisma)
    user = JSON.parse(JSON.stringify(user))

    return {
        props: {
          jobs,
          user,
        },
    }
}
