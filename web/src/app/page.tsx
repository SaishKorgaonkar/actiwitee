import { Nav } from '@/components/nav'
import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { Sources } from '@/components/sources'
import { ApiSection } from '@/components/api-section'
import { Guide } from '@/components/guide'
import { Cta } from '@/components/cta'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <Sources />
        <ApiSection />
        <Guide />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
