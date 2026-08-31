import { useEffect, useState } from 'react'
import { Bookmark, ChevronLeft, ChevronRight, Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { createRoot } from 'react-dom/client'
import './instagram.css'

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
