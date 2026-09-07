import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Activity, Bookmark, Bike, ChevronLeft, ChevronRight, Dumbbell, Heart, MessageCircle, MoreHorizontal, Send, UserRound } from 'lucide-react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import './instagram.css'
import './discipline-carousel.css'
import discipline01 from '../assets/discipline-01.jpg'
import discipline02 from '../assets/discipline-02.jpg'
import discipline03 from '../assets/discipline-03.jpg'
import discipline04 from '../assets/discipline-04.jpg'
import discipline05 from '../assets/discipline-05.jpg'
import discipline06 from '../assets/discipline-06.jpg'
import discipline07 from '../assets/discipline-07.jpg'
import instagram01 from '../assets/instagram-derek-01.jpeg'
import instagram02 from '../assets/instagram-derek-02.jpeg'
import instagram03 from '../assets/instagram-derek-03.jpeg'
import instagram04 from '../assets/instagram-derek-04.jpeg'
import instagram05 from '../assets/instagram-derek-05.png'
import derekLogo from '../assets/derek-logo.jpg'
import gymBackground from '../assets/gym-background.jpg'
import ctaGym from '../assets/cta-gym.jpg'
import coachAbril from '../assets/coach-abril-salazar.png'
import coachJesus from '../assets/coach-jesus-andrade.png'
import coachGonzalo from '../assets/coach-gonzalo-aguero.png'
import coachLuz from '../assets/coach-luz-gramajo.png'
import coachJose from '../assets/coach-jose-diaz.png'

type InstagramCarousel = [string, string, string, string, string]

type InstagramPostProps = {
  username: string
  userAvatar: string
  imageUrl?: string
  images?: InstagramCarousel
  caption: string
  likesCount: number
  location?: string
}

function useSwipe(onSwipe: (direction: 'previous' | 'next') => void) {
  const start = useRef<{ x: number; y: number } | null>(null)
  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => { if (event.pointerType !== 'mouse' || event.button === 0) start.current = { x: event.clientX, y: event.clientY } }
  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => { if (!start.current) return; const dx = event.clientX - start.current.x; const dy = event.clientY - start.current.y; if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) event.preventDefault() }
  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => { if (!start.current) return; const dx = event.clientX - start.current.x; const dy = event.clientY - start.current.y; start.current = null; if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.2) onSwipe(dx < 0 ? 'next' : 'previous') }
  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: () => { start.current = null } }
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
  const swipe = useSwipe((direction) => setCurrentSlide((slide) => direction === 'next' ? Math.min(carouselImages.length - 1, slide + 1) : Math.max(0, slide - 1)))

  const goTo = (slide: number) => setCurrentSlide((slide + carouselImages.length) % carouselImages.length)

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
         <div className="instagram-post__carousel" tabIndex={0} role="region" aria-roledescription="carousel" aria-label={`Photo ${currentSlide + 1} of ${carouselImages.length}`} {...swipe} onKeyDown={(event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); goTo(currentSlide + (event.key === 'ArrowRight' ? 1 : -1)) } }}>
           <div className="instagram-post__media-stack" aria-live="polite">
             {carouselImages.map((image, index) => <img key={image} className={`instagram-post__media ${index === currentSlide ? 'is-active' : ''} ${index === currentSlide - 1 ? 'is-previous' : ''} ${index === currentSlide + 1 ? 'is-next' : ''}`} src={image} loading={index === currentSlide ? 'eager' : 'lazy'} decoding="async" alt={index === currentSlide ? `Instagram post photo ${currentSlide + 1} of ${carouselImages.length}` : ''} aria-hidden={index !== currentSlide} />)}
           </div>
           <button className="instagram-post__carousel-button instagram-post__carousel-button--previous" type="button" aria-label="Previous photo" onClick={() => goTo(currentSlide - 1)}><ChevronLeft aria-hidden="true" /></button>
           <button className="instagram-post__carousel-button instagram-post__carousel-button--next" type="button" aria-label="Next photo" onClick={() => goTo(currentSlide + 1)}><ChevronRight aria-hidden="true" /></button>
          <div className="instagram-post__indicators" aria-label="Choose photo">
             {carouselImages.map((_, index) => <button key={index} type="button" aria-label={`Show photo ${index + 1}`} aria-current={currentSlide === index} onClick={() => goTo(index)} />)}
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
  discipline01, discipline02, discipline03, discipline04, discipline05, discipline06, discipline07,
]

const disciplineDescriptions = [
  { title: 'Musculación', description: 'Fuerza, técnica y progreso a tu medida.', icon: Dumbbell },
  { title: 'Funcional', description: 'Movimiento real para una vida más activa.', icon: Activity },
  { title: 'Cardio & cycling', description: 'Energía, ritmo y una dosis extra de motivación.', icon: Bike },
  { title: 'Personal training', description: 'Un plan diseñado exclusivamente para vos.', icon: UserRound },
]

export function DisciplineCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const goTo = (slide: number) => setCurrentSlide((slide + disciplineSlides.length) % disciplineSlides.length)
  const swipe = useSwipe((direction) => goTo(currentSlide + (direction === 'next' ? 1 : -1)))

  return (
    <div className="discipline-carousel">
      <div className="discipline-carousel__viewport" {...swipe} role="region" aria-roledescription="carousel" aria-label="Derek training disciplines, 7 slides" tabIndex={0} onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') goTo(currentSlide - 1)
        if (event.key === 'ArrowRight') goTo(currentSlide + 1)
      }}>
        <div className="discipline-carousel__track">
          {disciplineSlides.map((imageUrl, index) => (
            <div className={`discipline-carousel__slide ${index === currentSlide ? 'is-active' : ''} ${index === (currentSlide - 1 + disciplineSlides.length) % disciplineSlides.length ? 'is-previous' : ''} ${index === (currentSlide + 1) % disciplineSlides.length ? 'is-next' : ''}`} role="group" aria-roledescription="slide" aria-label={`Discipline image ${index + 1} of ${disciplineSlides.length}`} aria-hidden={index !== currentSlide} key={index}>
              <img src={imageUrl} alt={`Derek gym discipline ${index + 1}`} loading={index === currentSlide || index === (currentSlide + 1) % disciplineSlides.length || index === (currentSlide - 1 + disciplineSlides.length) % disciplineSlides.length ? 'eager' : 'lazy'} fetchPriority={index === currentSlide ? 'high' : 'low'} decoding="async" />
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

const aboutSlides = [
  { src: gymBackground, alt: 'Panoramic view of Derek Gym Center' },
  { src: ctaGym, alt: 'Derek Gym Center training area' },
] as const

export function AboutCarousel() {
  const [current, setCurrent] = useState(0)
  const go = (step: number) => setCurrent((slide) => (slide + step + aboutSlides.length) % aboutSlides.length)
  const swipe = useSwipe((direction) => go(direction === 'next' ? 1 : -1))

  return <div className="about-carousel" {...swipe} role="region" aria-roledescription="carousel" aria-label="Derek Gym Center photos" tabIndex={0} onKeyDown={(event) => { if (event.key === 'ArrowLeft') go(-1); if (event.key === 'ArrowRight') go(1) }}>
    <div className="about-carousel__viewport">
       {aboutSlides.map((slide, index) => <div className={`about-carousel__slide ${index === current ? 'is-active' : ''}`} key={slide.src} role="group" aria-roledescription="slide" aria-label={`Photo ${index + 1} of ${aboutSlides.length}`} aria-hidden={index !== current}><img src={slide.src} alt={slide.alt} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" /></div>)}
      <button className="about-carousel__control about-carousel__control--previous" type="button" aria-label="Previous photo" onClick={() => go(-1)}><ChevronLeft aria-hidden="true" /></button>
      <button className="about-carousel__control about-carousel__control--next" type="button" aria-label="Next photo" onClick={() => go(1)}><ChevronRight aria-hidden="true" /></button>
    </div>
    <div className="about-carousel__indicators" aria-label="Choose photo">{aboutSlides.map((slide, index) => <button key={slide.src} type="button" aria-label={`Show photo ${index + 1}`} aria-current={current === index} onClick={() => setCurrent(index)} />)}</div>
  </div>
}

type Coach = { name: string; schedule: string; className: string; photo: string }
const coaches: Coach[] = [
  { name: 'Abril Salazar', schedule: 'Lunes a viernes · 07:00 — 12:00', className: 'a1', photo: coachAbril },
  { name: 'Jesús Andrade', schedule: 'Lunes a viernes · 12:00 — 18:00', className: 'a2', photo: coachJesus },
  { name: 'Gonzalo Agüero', schedule: 'Lunes a viernes · 18:00 — 23:00', className: 'a3', photo: coachGonzalo },
  { name: 'Luz Gramajo', schedule: 'Lunes a viernes · 18:00 — 23:00', className: 'a4', photo: coachLuz },
  { name: 'José Díaz', schedule: 'Sábados · 10:00 — 12:00 y 16:00 — 21:00\nDomingos · 18:00 — 22:00', className: 'a5', photo: coachJose },
]

function useCarousel(length: number, initial = 0, autoplay = false) {
  const [current, setCurrent] = useState(initial)
  const [paused, setPaused] = useState(false)
  useEffect(() => { if (!autoplay || paused) return; const timer = window.setInterval(() => setCurrent((value) => (value + 1) % length), 3500); return () => window.clearInterval(timer) }, [autoplay, length, paused])
  const go = (step: number) => setCurrent((value) => (value + step + length) % length)
  return { current, setCurrent, go, paused, setPaused }
}

function CarouselControls({ current, length, go, setCurrent, label }: { current: number; length: number; go: (step: number) => void; setCurrent: (value: number) => void; label: string }) {
  return <><button className="carousel-control carousel-control--previous" type="button" aria-label={`Previous ${label}`} onClick={() => go(-1)}><ChevronLeft aria-hidden="true" /></button><button className="carousel-control carousel-control--next" type="button" aria-label={`Next ${label}`} onClick={() => go(1)}><ChevronRight aria-hidden="true" /></button><div className="carousel-indicators" aria-label={`Choose ${label}`}>{Array.from({ length }, (_, index) => <button key={index} type="button" aria-label={`Show ${label} ${index + 1}`} aria-current={current === index} onClick={() => setCurrent(index)} />)}</div></>
}

export function CoachCarousel() { const carousel = useCarousel(coaches.length); const swipe = useSwipe((direction) => carousel.go(direction === 'next' ? 1 : -1)); return <div className="card-carousel coach-carousel" {...swipe} role="region" aria-roledescription="carousel" aria-label="Derek coaches" tabIndex={0} onMouseEnter={() => carousel.setPaused(true)} onMouseLeave={() => carousel.setPaused(false)} onFocus={() => carousel.setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) carousel.setPaused(false) }} onKeyDown={(event) => { if (event.key === 'ArrowLeft') carousel.go(-1); if (event.key === 'ArrowRight') carousel.go(1) }}><div className="carousel-card-track">{coaches.map((coach, index) => { const previous = (carousel.current - 1 + coaches.length) % coaches.length; const next = (carousel.current + 1) % coaches.length; return <article className={`trainer-card carousel-card ${index === carousel.current ? 'is-active' : ''} ${index === previous ? 'is-previous' : ''} ${index === next ? 'is-next' : ''}`} aria-hidden={index !== carousel.current} key={coach.name}><div className={`avatar ${coach.className}`}><img src={coach.photo} alt={`Portrait of ${coach.name}`} /></div><b>{coach.name}</b><span className="trainer-schedule">{coach.schedule}</span></article> })}</div><CarouselControls {...carousel} length={coaches.length} label="coach" /></div> }

const plans = [
  { type: 'Día', price: '$6.000', detail: '', description: 'Ideal para entrenar cuando quieras.', featured: false },
  { type: 'Mensual', price: '$30.000', detail: '/mes', description: 'Constancia y acompañamiento todo el mes.', featured: true },
  { type: 'Quincenal', price: '$18.000', detail: '/15 días', description: 'Flexibilidad para mantener tu ritmo.', featured: false },
]
export function PlansCarousel() { const carousel = useCarousel(plans.length, 1); const swipe = useSwipe((direction) => carousel.go(direction === 'next' ? 1 : -1)); return <div className="card-carousel plans-carousel" {...swipe} role="region" aria-roledescription="carousel" aria-label="Derek plans" tabIndex={0} onFocus={() => carousel.setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) carousel.setPaused(false) }} onKeyDown={(event) => { if (event.key === 'ArrowLeft') carousel.go(-1); if (event.key === 'ArrowRight') carousel.go(1) }}><div className="carousel-card-track">{plans.map((plan, index) => { const previous = (carousel.current - 1 + plans.length) % plans.length; const next = (carousel.current + 1) % plans.length; return <article className={`plan carousel-card ${plan.featured ? 'featured' : ''} ${index === carousel.current ? 'is-active' : ''} ${index === previous ? 'is-previous' : ''} ${index === next ? 'is-next' : ''}`} aria-hidden={index !== carousel.current} key={plan.type}>{plan.featured && <label>Más elegido</label>}<span>{plan.type}</span><h3>{plan.price}<small>{plan.detail}</small></h3><p>{plan.description}</p><ul><li>Entrenador</li><li>Asesoramiento y seguimiento</li></ul><small className="plan-payment">Efectivo / Transferencia</small><a href="https://ig.me/m/derek_gym_lules" target="_blank" rel="noopener" className={`button ${plan.featured ? 'primary' : 'outline'} plan-btn`}>Elegir plan</a></article> })}</div><CarouselControls {...carousel} length={plans.length} label="plan" /></div> }

const instagramRoot = document.getElementById('instagram-post-root')

if (instagramRoot) {
  createRoot(instagramRoot).render(
    <InstagramPost
      username="derek_gym_lules"
       userAvatar={derekLogo}
      images={[
          instagram01, instagram02, instagram03, instagram04, instagram05,
      ] as InstagramCarousel}
      caption="Entrená a tu manera, todos los días."
      likesCount={128}
      location="San Isidro de Lules"
    />,
  )
}

const disciplineRoot = document.getElementById('discipline-carousel-root')
if (disciplineRoot) createRoot(disciplineRoot).render(<DisciplineCarousel />)
const aboutRoot = document.getElementById('about-carousel-root')
if (aboutRoot) createRoot(aboutRoot).render(<AboutCarousel />)
const coachSection = document.getElementById('profes')
const coachRoot = document.createElement('div'); coachRoot.id = 'coach-carousel-root'
if (coachSection) {
  coachSection.querySelector('.trainers')?.insertAdjacentElement('afterend', coachRoot)
  try {
    flushSync(() => createRoot(coachRoot).render(<CoachCarousel />))
    requestAnimationFrame(() => {
      if (coachRoot.childElementCount > 0) coachSection.classList.add('react-carousel-ready')
    })
  } catch (error) {
    console.error('Coach carousel failed; keeping the static fallback visible.', error)
  }
}
const plansSection = document.getElementById('planes')
const plansRoot = document.createElement('div'); plansRoot.id = 'plans-carousel-root'
if (plansSection) {
  plansSection.querySelector('.plans')?.insertAdjacentElement('afterend', plansRoot)
  try {
    flushSync(() => createRoot(plansRoot).render(<PlansCarousel />))
    requestAnimationFrame(() => {
      if (plansRoot.childElementCount > 0) plansSection.classList.add('react-carousel-ready')
    })
  } catch (error) {
    console.error('Plans carousel failed; keeping the static fallback visible.', error)
  }
}
document.querySelector('.band h2 em')?.replaceChildren('Empezamos juntos.')
