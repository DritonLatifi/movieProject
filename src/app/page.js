"use client"

import Category from "@/components/category"
import Footer from "@/components/footer"
import Toggle from "@/components/toggle"
import Rating from "@/components/rating"
import Genre from "@/components/genre"
import Slider from "@/components/slider"

import { useEffect, useRef, useState } from "react"

import { useRouter } from "next/navigation"

import Image from "next/image"
import Link from "next/link"

import { FaClock } from "react-icons/fa6"
import { useSearchParams } from "next/navigation"


export default function Home() {
  const [popular, setPopular] = useState([])
  const [trending, setTrending] = useState([])
  const [searchResult, setSearchResult] = useState([])

  const ref = useRef(null)
  const searchRef = useRef(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    (async () => {
      if ("serviceWorker" in navigator) await navigator.serviceWorker.register("/sw.js")

      if (navigator.onLine && searchParams.get('request_token')) {
        await fetch('https://api.themoviedb.org/3/authentication/session/new', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_API_KEY,
            accept: 'application/json',
            'content-type': 'application/json'
          },
          body: JSON.stringify({ request_token: searchParams.get('request_token') })
        }).then(res => res.json()).then(async data => {
          await fetch(`https://api.themoviedb.org/3/account/account_id?session_id=${data.session_id}`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_API_KEY
            }
          }).then(res => res.json()).then(session => {
            window.localStorage.setItem('userID', session.id)
          })
        })
      }

      const popularRes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=d61d03c4897622853f09d1e0b7a41c5b&page=1`, { cache: "force-cache" })
      const popularData = await popularRes.json()

      const trendingRes = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&api_key=d61d03c4897622853f09d1e0b7a41c5b`, { cache: "force-cache" })
      const trendingData = await trendingRes.json()

      console.log(trendingData);

      // Descendingly sort the higher rated movies
      popularData.results.sort((a, b) => b.vote_average - a.vote_average)

      setPopular(popularData.results)
      setTrending(trendingData.results)
    })()
  }, [])

  async function changeHandler(e) {
    e.target.value.length > 0 ? searchRef.current.style.height = '500px' : searchRef.current.style.height = '0px'

    const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${e.target.value}&api_key=d61d03c4897622853f09d1e0b7a41c5b`, { cache: "force-cache" })
    const data = await res.json()

    data.results.sort((a, b) => b.vote_average - a.vote_average)

    setSearchResult(data.results)
  }

  function redirectHandler(e) {
    if (e.code == 'Enter') router.push('http://localhost:3000/browse?query=' + e.target.value)
  }

  return (
    <div ref={ref} className="bg-white">
      <header className="h-[100px] mb-2">
        <div className="flex justify-between h-full items-center w-full px-6 float-right">
          <div className="relative flex flex-col w-fit">
            <input type="search" onChange={changeHandler} onKeyUp={redirectHandler} className="bg-inherit w-full" placeholder="Fight Club.."></input>
            <div ref={searchRef} className="absolute flex flex-col w-fit mt-7 bg-black transition-all duration-1000 text-white overflow-y-scroll overflow-x-hidden">
              {searchResult.map((movie) => {
                return (
                  <Link href={navigator.onLine ? `/${movie?.id}` : '/'} key={movie?.id} className="flex gap-2 h-40">
                    <Image src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`} height={100} width={120} className="rounded-md object-cover" alt="movie" />
                    <div className="flex flex-col justify-evenly w-3/4">
                      <h2 className="font-bold">{movie?.title}</h2>
                      <div className="flex items-center gap-2">
                        <Rating rating={movie?.vote_average} />
                      </div>
                      <div className={`flex flex-nowrap gap-2 pr-12 ${movie?.genre_ids.length > 3 ? '' : 'overflow-x-hidden'} overflow-y-hidden`}>
                        <Genre ids={movie?.genre_ids} />
                      </div>
                      <span className="flex items-center gap-2">
                        <FaClock />
                        1h 10min
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
          <h1 className="text-2xl font-bold">MyMovie</h1>
          {ref.current && <Toggle element={ref.current} />}
        </div>
      </header>
      <main className="flex flex-col gap-6 m-auto">
        <div className="flex flex-col gap-4">
          <section className="flex justify-between w-[90%] m-auto">
            <Category heading="now showing" />
          </section>
          <article className="flex gap-4 px-6 h-[365px] overflow-x-scroll overflow-y-hidden">
            <Slider array={trending} />
          </article>
        </div>
        <div className="flex flex-col gap-4">
          <section className="flex justify-between w-[90%] m-auto">
            <Category heading="popular" />
          </section>
          <article className="flex flex-col w-full gap-4 pl-6 pb-32 overflow-x-hidden">
            {popular.map((movie) => {
              return (
                <Link href={`/${movie?.id}`} key={movie?.id} className="flex gap-2 h-40">
                  <Image src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`} height={100} width={120} className="rounded-md object-cover" alt="movie" />
                  <div className="flex flex-col justify-evenly w-3/4">
                    <h2 className="font-bold">{movie?.title}</h2>
                    <div className="flex items-center gap-2">
                      <Rating rating={movie?.vote_average} />
                    </div>
                    <div className={`flex flex-nowrap gap-2 pr-12 ${movie?.genre_ids.length > 3 ? '' : 'overflow-x-hidden'} overflow-y-hidden`}>
                      <Genre ids={movie?.genre_ids} />
                    </div>
                    <span className="flex items-center gap-2">
                      <FaClock />
                      1h 10min
                    </span>
                  </div>
                </Link>
              )
            })}
          </article>
        </div>
      </main>
      <Footer page={'home'} />
    </div>
  )
}
