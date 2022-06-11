// API route called from /job/[id]/apply.js
// POSTS an application- cover letter to the db

import prisma from 'lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {

    if (req.method !== 'POST') { // we reject any request that’s not a POST request,
        return res.status(501).end()
    }

    const session = await getSession({ req })
    // check if the user is logged in.
    if (!session) return res.status(401).json({ message: 'Not logged in' })

    // find user id through the session data, and we first validate the user.
    const user = await prisma.user.findUnique({
        where: {
        id: session.user.id,
        },
    })
    if (!user) return res.status(401).json({ message: 'User not found' })

    // validate the parameter coverletter exists
    if (req.method === 'POST') {
        if (!req.body.coverletter)
            return res
        .status(400)
        .json({ message: 'Required parameter coverletter missing' })

        if (!req.body.job)
            return res.status(400).json({ message: 'Required parameter job missing' })


        // create the endpoint, associating it with the correct Job and User(candidate):
        await prisma.application.create({
        data: {
            coverletter: req.body.coverletter,
            job: {
            connect: { id: req.body.job },
            },
            author: {
            connect: { id: session.user.id },
            },
         },
        })
        res.status(200).end()
        return
    }
}