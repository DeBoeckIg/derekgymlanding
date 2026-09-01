import { useEffect, useState } from 'react'
import { Activity, Bookmark, Bike, ChevronLeft, ChevronRight, Dumbbell, Heart, MessageCircle, MoreHorizontal, Send, UserRound } from 'lucide-react'
import { createRoot } from 'react-dom/client'
import './instagram.css'
import './discipline-carousel.css'

type InstagramCarousel = [string, string, string, string]

type InstagramPostProps = {
  username: string
  userAvatar: string
  imageUrl?: string
  images?: InstagramCarousel
  caption: string
  likesCount: number
  location?: string
}

export function InstagramPost({
  username,
  userAvatar,
  imageUrl,
  images,
  caption,
  likesCount,
  location,
}: InstagramPostProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselImages = images ?? (imageUrl ? [imageUrl] : [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') setCurrentSlide((slide) => Math.max(0, slide - 1))
      if (event.key === 'ArrowRight') setCurrentSlide((slide) => Math.min(carouselImages.length - 1, slide + 1))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [carouselImages.length])

  return (
    <article className="instagram-post" aria-label={`Instagram post by ${username}`}>
      <header className="instagram-post__header">
        {userAvatar ? <img className="instagram-post__avatar" src={userAvatar} alt="" /> : <span className="instagram-post__avatar instagram-post__avatar--placeholder" aria-hidden="true" />}
        <div>
          <strong>{username}</strong>
          {location && <small>{location}</small>}
        </div>
        <button className="instagram-post__icon-button" type="button" aria-label="More post options">
          <MoreHorizontal aria-hidden="true" />
        </button>
      </header>

      {carouselImages.length ? (
        <div className="instagram-post__carousel" tabIndex={0} aria-label={`Photo ${currentSlide + 1} of ${carouselImages.length}`}>
          <img className="instagram-post__media" src={carouselImages[currentSlide]} alt={`Instagram post photo ${currentSlide + 1} of ${carouselImages.length}`} />
          <button className="instagram-post__carousel-button instagram-post__carousel-button--previous" type="button" aria-label="Previous photo" disabled={currentSlide === 0} onClick={() => setCurrentSlide((slide) => Math.max(0, slide - 1))}><ChevronLeft aria-hidden="true" /></button>
          <button className="instagram-post__carousel-button instagram-post__carousel-button--next" type="button" aria-label="Next photo" disabled={currentSlide === carouselImages.length - 1} onClick={() => setCurrentSlide((slide) => Math.min(carouselImages.length - 1, slide + 1))}><ChevronRight aria-hidden="true" /></button>
          <div className="instagram-post__indicators" aria-label="Choose photo">
            {carouselImages.map((_, index) => <button key={index} type="button" aria-label={`Show photo ${index + 1}`} aria-current={currentSlide === index} onClick={() => setCurrentSlide(index)} />)}
          </div>
        </div>
      ) : (
        <div className="instagram-post__placeholder" role="img" aria-label="Photo placeholder" />
      )}

      <div className="instagram-post__body">
        <div className="instagram-post__actions">
          <button className="instagram-post__icon-button" type="button" aria-label={liked ? 'Unlike post' : 'Like post'} aria-pressed={liked} onClick={() => setLiked(!liked)}>
            <Heart aria-hidden="true" />
          </button>
          <button className="instagram-post__icon-button" type="button" aria-label="Comment on post">
            <MessageCircle aria-hidden="true" />
          </button>
          <button className="instagram-post__icon-button" type="button" aria-label="Share post">
            <Send aria-hidden="true" />
          </button>
          <button className="instagram-post__icon-button instagram-post__save" type="button" aria-label={saved ? 'Remove post from saved' : 'Save post'} aria-pressed={saved} onClick={() => setSaved(!saved)}>
            <Bookmark aria-hidden="true" />
          </button>
        </div>
        <strong>{(likesCount + (liked ? 1 : 0)).toLocaleString()} likes</strong>
        <p><b>{username}</b> {caption}</p>
      </div>
    </article>
  )
}

type DisciplineSlideSlots = [string, string, string, string, string, string, string]

const disciplineSlides: DisciplineSlideSlots = [
  '/assets/discipline-01.jpg',
  '/assets/discipline-02.jpg',
  '/assets/discipline-03.jpg',
  '/assets/discipline-04.jpg',
  '/assets/discipline-05.jpg',
  '/assets/discipline-06.jpg',
  '/assets/discipline-07.jpg',
]

const disciplineDescriptions = [
  { title: 'Musculación', description: 'Fuerza, técnica y progreso a tu medida.', icon: Dumbbell },
  { title: 'Funcional', description: 'Movimiento real para una vida más activa.', icon: Activity },
  { title: 'Cardio & cycling', description: 'Energía, ritmo y una dosis extra de motivación.', icon: Bike },
  { title: 'Personal training', description: 'Un plan diseñado exclusivamente para vos.', icon: UserRound },
]

export function DisciplineCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const goTo = (slide: number) => setCurrentSlide((slide + disciplineSlides.length) % disciplineSlides.length)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches)
    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)
    return () => mediaQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    if (reducedMotion || isHovered || isFocused) return
    const timer = window.setInterval(() => setCurrentSlide((slide) => (slide + 1) % disciplineSlides.length), 2000)
    return () => window.clearInterval(timer)
  }, [isFocused, isHovered, reducedMotion])

  return (
    <div className="discipline-carousel">
      <div className="discipline-carousel__viewport" role="region" aria-roledescription="carousel" aria-label="Derek training disciplines, 7 slides" tabIndex={0} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onFocus={() => setIsFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsFocused(false) }} onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') goTo(currentSlide - 1)
        if (event.key === 'ArrowRight') goTo(currentSlide + 1)
      }}>
        <div className="discipline-carousel__track">
          {disciplineSlides.map((imageUrl, index) => (
            <div className={`discipline-carousel__slide ${index === currentSlide ? 'is-active' : ''} ${index === (currentSlide - 1 + disciplineSlides.length) % disciplineSlides.length ? 'is-previous' : ''} ${index === (currentSlide + 1) % disciplineSlides.length ? 'is-next' : ''}`} role="group" aria-roledescription="slide" aria-label={`Discipline image ${index + 1} of ${disciplineSlides.length}`} aria-hidden={index !== currentSlide} key={index}>
              <img src={imageUrl} alt={`Derek gym discipline ${index + 1}`} />
            </div>
          ))}
        </div>
        <button className="discipline-carousel__control discipline-carousel__control--previous" type="button" aria-label="Previous discipline image" onClick={() => goTo(currentSlide - 1)}><ChevronLeft aria-hidden="true" /></button>
        <button className="discipline-carousel__control discipline-carousel__control--next" type="button" aria-label="Next discipline image" onClick={() => goTo(currentSlide + 1)}><ChevronRight aria-hidden="true" /></button>
      </div>
      <div className="discipline-carousel__indicators" aria-label="Choose one of 7 discipline images">
        {disciplineSlides.map((_, index) => <button key={index} type="button" aria-label={`Show discipline image ${index + 1}`} aria-current={currentSlide === index} onClick={() => goTo(index)} />)}
      </div>
      <dl className="discipline-descriptions">
        {disciplineDescriptions.map(({ title, description, icon: Icon }) => <div className="discipline-description" key={title}><dt><Icon aria-hidden="true" />{title}</dt><dd>{description}</dd></div>)}
      </dl>
    </div>
  )
}

const instagramRoot = document.getElementById('instagram-post-root')

if (instagramRoot) {
  createRoot(instagramRoot).render(
    <InstagramPost
      username="derek_gym_lules"
      userAvatar="/assets/derek-logo.jpg"
      images={[
        '/assets/instagram-derek-01.jpeg',
        '/assets/instagram-derek-02.jpeg',
        '/assets/instagram-derek-03.jpeg',
        '/assets/instagram-derek-04.jpeg',
      ] as InstagramCarousel}
      caption="Entrená a tu manera, todos los días."
      likesCount={128}
      location="San Isidro de Lules"
    />,
  )
}

const disciplineRoot = document.getElementById('discipline-carousel-root')
if (disciplineRoot) createRoot(disciplineRoot).render(<DisciplineCarousel />)
