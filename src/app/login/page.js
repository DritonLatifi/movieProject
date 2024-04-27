"use client"

import { useEffect } from "react"

import { useRouter } from "next/navigation"

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        (async () => {
            const res = await fetch('https://api.themoviedb.org/3/authentication/token/new', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_API_KEY
                }
            })
            
            const { request_token } = await res.json()

            router.push(`https://www.themoviedb.org/authenticate/${request_token}?redirect_to=http://localhost:3000/`)
        })()
    }, [])

    return (
        <></>
    )
}