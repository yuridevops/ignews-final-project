import { NextApiRequest, NextApiResponse } from 'next'

export default (request: NextApiRequest, response: NextApiResponse) => {

    const id = request.query.id
    
    const users = [
        { id: 1, name: 'Marcos Yuri' },
        { id: 2, name: 'Elis Regina' },
        { id: 3, name: 'Alexandre Jasper' }
    ]
    return response.json(users)
}