import Job from 'components/Job'

// jobs will be an array and we can iterate over using a map.
// call the Job component to actually get the job details
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