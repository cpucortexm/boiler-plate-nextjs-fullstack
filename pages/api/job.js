// API route for /new.
// Companies submit their new jobs through /new using /api/job

import prisma from 'lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(501).end()
    }

    // get the current session and we get the user object
    // from Prisma, or we end with a 401 status “Not Authorized” if the user
    // is not logged in
    const session = await getSession({ req })

    if (!session) return res.status(401).json({ message: 'Not logged in' })

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    })
    
    if (!user) return res.status(401).json({ message: 'User not found' })

    // if the user is found, we do some validation and we make sure we have all the data we need:
    if (req.method === 'POST') {
        if (!req.body.title)
        return res
            .status(400)
            .json({ message: 'Required parameter title missing' })
        if (!req.body.description)
        return res
            .status(400)
            .json({ message: 'Required parameter description missing' })
        if (!req.body.location)
        return res
            .status(400)
            .json({ message: 'Required parameter location missing' })
        if (!req.body.salary)
        return res
            .status(400)
            .json({ message: 'Required parameter salary missing' })


        await prisma.job.create({
            data: {
                    title: req.body.title,
                    description: req.body.description,
                    location: req.body.location,
                    salary: req.body.salary,
                    author: {
                    connect: { id: user.id },
                    },
                },
            })
        res.status(200).end()
    }

}