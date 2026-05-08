'use client'

import { useEffect } from 'react'
import { motion, type Variants } from 'framer-motion'
import { AiOutlineFileDone } from 'react-icons/ai'
import { FaWhatsapp } from 'react-icons/fa'
import { useSolicitudStore } from '@/lib/solicitud/store'
import Link from 'next/link'
import { exitoCopy as copy } from '@/content/solicitar'

interface Props {
  folio: string
  telefono?: string
}

const WHATSAPP_GREEN = '#25D366'

const exitoContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const exitoItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const exitoAvatar: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  },
}

export default function PantallaExito({ folio, telefono }: Props) {
  const resetForm = useSolicitudStore((s) => s.resetForm)

  useEffect(() => {
    resetForm()
  }, [resetForm])

  return (
    <motion.div
      className="mx-auto flex max-w-2xl flex-col items-center px-4 py-8 text-center md:py-16"
      variants={exitoContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={exitoAvatar}
        className="mb-6 flex size-24 items-center justify-center rounded-full bg-green-100"
      >
        <AiOutlineFileDone className="size-12 text-green-500" aria-hidden />
      </motion.div>

      <motion.h1
        variants={exitoItem}
        className="mb-4 font-headline text-3xl font-bold tracking-tight text-gray-900"
      >
        {copy.titulo}
      </motion.h1>
      <motion.p variants={exitoItem} className="mb-8 max-w-md text-base text-gray-600">
        {copy.subtituloPrefijo}
        <strong className="font-bold">{copy.subtituloEnfasis}</strong>
        {copy.subtituloSufijo}
      </motion.p>

      <motion.div
        variants={exitoItem}
        className="mb-8 w-full max-w-sm rounded-3xl border p-6"
        style={{
          backgroundColor: `${WHATSAPP_GREEN}1A`,
          borderColor: `${WHATSAPP_GREEN}33`,
        }}
      >
        <div className="mb-4 flex items-center justify-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: WHATSAPP_GREEN }}
          >
            <FaWhatsapp className="size-5 text-white" aria-hidden />
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-600">{copy.labelProximosPasos}</p>
            {telefono && <p className="font-bold text-gray-900">{telefono}</p>}
          </div>
        </div>
        <p className="mb-4 text-xs text-gray-600">{copy.mensajeContacto}</p>

        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
          <p className="mb-1 text-xs text-gray-500">{copy.labelFolio}</p>
          <p className="font-mono text-lg font-bold tracking-widest text-primary">{folio}</p>
        </div>
      </motion.div>

      <motion.div variants={exitoItem}>
        <Link
          href="/"
          className="inline-block rounded-full bg-primary px-8 py-4 font-bold text-white shadow-lg transition-colors hover:bg-primary/90 active:scale-[0.98]"
        >
          {copy.botonInicio}
        </Link>
      </motion.div>
    </motion.div>
  )
}
