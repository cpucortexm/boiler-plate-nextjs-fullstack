import Link from 'next/link'
import { useRouter } from 'next/router'

// return a Job JSX component
// called by the Jobs component

const Job = ({ job, isDashboard }) => {
  const router = useRouter()

  async function onClickHandler(published){
        // set the default to publish
        let bodydefault = JSON.stringify({
                          id: job.id,
                          task: 'publish',
                        })
        // check the published flag and change to unpublish
        if(published){
            bodydefault = JSON.stringify({
                            id: job.id,
                            task: 'unpublish',
                          })
          }

        const requestParams = {
              body: bodydefault,
              headers: {'Content-Type': 'application/json',},
              method: 'PUT',
        }
        // Make a PUT request to /api/job
        const result = await fetch('/api/job', requestParams)
        router.reload(window.location.pathname)
  }

  return (
    <div className='mb-4 mt-20 pl-16 pr-16'>
      <Link href={`/job/${job.id}`}>
        <a className='text-xl font-bold underline'>{job.title}</a>
      </Link>
      <h2 className='text-base font-normal mt-3'>{job.description}</h2>
      <div className='mt-4'>

        {/* Display published and Unpublished jobs separately in company Dashboard;*/}
        {/* &#128505 for tick mark and  &#x2718 for cross mark*/}
        {/*Don't directly call functions in onClick event. It will recursively call
         the method. So make the onClick input as a callback method.*/}
        {isDashboard && job.published && (
          <span className='bg-black text-white uppercase text-sm p-2 mr-5 cursor-pointer'          
           onClick = {()=>onClickHandler(job.published)}
          >
        &#128505;Published
          </span>
        )}
        {isDashboard && !job.published && (
          <span className='bg-black text-white uppercase text-sm p-2 mr-5 cursor-pointer'
          onClick = {()=>onClickHandler(job.published)}
          >
        &#x2718; Unpublished
          </span>
        )}
        
        
        <h4 className='inline'>Posted by</h4>
        <div className='ml-1 -mt-6 inline'>
              <span className='text-base font-medium color-primary underline'>
                {job.author.name}
              </span>
        </div>
      </div>
    </div>
  )
}

export default Job