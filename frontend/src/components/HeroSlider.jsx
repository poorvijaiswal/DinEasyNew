"use client"

import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    image: "https://wallpaperaccess.com/full/2275139.jpg",
    title: "Restaurant Management Made Easy",
    description: "Streamline your restaurant operations with our comprehensive management system",
  },
  {
    image: "https://i.pinimg.com/originals/7c/b1/86/7cb18679659f791b1191bea97b74dfc0.jpg",
    title: "Real-time Analytics",
    description: "Get detailed insights into your restaurant's performance",
  },
  {
    image: "https://img.freepik.com/free-photo/parmesan-pasta-recipe-with-piece-cheese-raw-pasta-other-ingredients_1220-583.jpg",
    title: "QR Code Ordering",
    description: "Contactless ordering system for a better dining experience",
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out
            ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute inset-0 bg-black/50" />
          <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">{slide.description}</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      ))}

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors
              ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}