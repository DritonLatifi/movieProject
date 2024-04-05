"use client"

import Category from "@/components/category";
import Footer from "@/components/footer";
import Toggle from "@/components/toggle";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import Rating from "@/components/rating";
import Genre from "@/components/genre";


export default function Home() {
  const [popular, setPopular] = useState([])
  const [trending, setTrending] = useState([])

  useEffect(() => {
    (async () => {
      const popularRes = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=d61d03c4897622853f09d1e0b7a41c5b&page=1')
      const popularData = await popularRes.json()

      const trendingRes = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US&api_key=d61d03c4897622853f09d1e0b7a41c5b')
      const trendingData = await trendingRes.json()

      popularData.results.sort((a, b) => b.vote_average - a.vote_average)
      
      setPopular(popularData.results)
      setTrending(trendingData.results)
    })()
  }, [])

  return (
    <>
      <header className="h-[100px] mb-2">
        <div className="flex justify-between h-full items-center w-2/3 px-6 float-right">
          <h1 className="text-2xl font-bold text-gray-800">MyMovie</h1>
          <Toggle />
        </div>
      </header>
      <main className="flex flex-col gap-6 m-auto">
        <div className="flex flex-col gap-4">
          <section className="flex justify-between w-[90%] m-auto">
            <Category heading="now showing" />
          </section>
          <article className="flex gap-4 pl-6">
            {trending.map((movie) => {
              return (
                <Image key={movie.id} src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} height={200} width={180} alt="movie" className="rounded-md" />
              )
            })}
          </article>
        </div>
        <div className="flex flex-col gap-4">
          <section className="flex justify-between w-[90%] m-auto">
            <Category heading="popular" />
          </section>
          <article className="flex flex-col gap-4 pl-6">
            {popular.map((movie) => {
              return (
                <Link href={`/${movie.id}`} key={movie.id} className="flex gap-2 h-40">
                  <Image src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} height={100} width={120} className="rounded-md object-cover" alt="movie" />
                  <div className="flex flex-col justify-evenly w-3/4">
                    <h2 className="font-bold">{movie.title}</h2>
                    <div className="flex items-center gap-2">
                      <Rating rating={movie.vote_average} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Genre ids={movie?.genre_ids} />
                    </div>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faClock} />
                      1h 10min
                    </span>
                  </div>
                </Link>
              )
            })}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
