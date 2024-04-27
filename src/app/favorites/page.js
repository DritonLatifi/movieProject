"use client"

import Category from "@/components/category"
import Footer from "@/components/footer"
import Genre from "@/components/genre"
import Rating from "@/components/rating"
import Image from 'next/image'
import Toggle from "@/components/toggle"

import { useEffect, useRef, useState } from "react"
import { FaClock } from "react-icons/fa6"

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter, useSearchParams } from "next/navigation"

export default function Home() {
    const router = useRouter()
    const searchParams = useSearchParams()

    if (searchParams.get('userID') == 'null' || searchParams.get('userID') == 'undefined') router.push('/login') 

    const [favorites, setFavorites] = useState([])
    const [loader, setLoader] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        (async () => {
            const favoriteRes = await fetch(`https://api.themoviedb.org/3/account/${searchParams.get('userID')}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_API_KEY
                }
            })
            const { results } = await favoriteRes.json()
            setFavorites(results)
        })()
    }, [loader])

    function removeHandler(e) {
        (async () => {
            await fetch(`https://api.themoviedb.org/3/account/${searchParams.get('userID')}/favorite`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_API_KEY
                },
                body: JSON.stringify({ media_type: 'movie', media_id: e.target.dataset.id, favorite: false })
            }).then(res => res.json()).then(() => {
                toast("Movie Was Removed", {
                    position: 'bottom-center',
                    autoClose: 1000,
                    draggable: true,
                    pauseOnHover: false,
                    hideProgressBar: true
                });
                setLoader(!loader)
            })
        })()
    }

    return (
        <div ref={ref} className="bg-white items-center overflow-x-hidden h-screen">
            <header className="flex justify-center gap-10 items-center h-20 px-10 mb-10 m-auto">
                <h1 className="text-center text-2xl font-bold">MyMovie</h1>
                {ref.current && <Toggle element={ref.current} />}
            </header>
            <main className="flex flex-col gap-4 px-10 pb-32">
                <div className="flex justify-between w-full">
                    <Category heading={'Favorites'} />
                </div>
                {favorites.map(bookmark => {
                    return (
                        <div key={bookmark?.id} className="flex gap-2 h-40">
                            <Image src={`https://image.tmdb.org/t/p/original/${bookmark.poster_path}`} height={100} width={120} className="rounded-md object-cover" alt="bookmark" />
                            <div className="flex flex-col justify-evenly w-3/4">
                                <h2 className="font-bold">{bookmark.title}</h2>
                                <div className="flex items-center gap-2">
                                    <Rating rating={bookmark.vote_average} />
                                </div>
                                <div className={`flex flex-nowrap gap-2 pr-12 ${bookmark.genre_ids.length > 3 ? '' : 'overflow-x-hidden'} overflow-y-hidden`}>
                                    <Genre ids={bookmark.genre_ids} />
                                </div>
                                <span className="flex items-center gap-2">
                                    <FaClock />
                                    1h 10min
                                </span>
                                <button data-id={bookmark.id} onClick={removeHandler} className="px-4 py-1 w-fit bg-black rounded-full text-white">Remove</button>
                            </div>
                        </div>
                    )
                })}
            </main>
            <Footer page={'favorites'} token={searchParams.get('userID')} />
            <ToastContainer />
        </div>
    )
}