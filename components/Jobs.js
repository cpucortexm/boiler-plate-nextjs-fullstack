import Job from 'components/Job'

// jobs will be an array and we can iterate over using a map.
// call the Job component to actually get the job details

// remove the isDashboard prop from the Jobs component now, as we’ll not use that any more.
const Jobs = ({ jobs }) => {
  if (!jobs) return null

  return (
    <>
      {jobs.map((job, index) => (
        <Job key={index} job={job} />
      ))}
    </>
  )
}

export default Jobs