import { Capacitor } from '@capacitor/core'
import { ArrowUpRight, BadgeCheck, Download, ShieldCheck, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apkInfo } from '../data/app'

const steps = [
  { title: 'Descarga el archivo', text: 'Toca "Descargar APK" desde tu teléfono o escanea el código QR con la cámara.' },
  { title: 'Permite la instalación', text: 'Android te pedirá autorizar la instalación desde el navegador ("Instalar apps desconocidas"). Es un paso normal para apps que no vienen de Play Store.' },
  { title: 'Abre VOKTER', text: 'Instala, abre la app y compra con tu carrito, favoritos y puntos guardados en el teléfono.' },
]

export function DownloadPage() {
  if (Capacitor.isNativePlatform()) return <section className="page-section download-page"><div className="empty-icon"><BadgeCheck size={24} /></div><p className="eyebrow">APP VOKTER / {apkInfo.version}</p><h1>Ya estás<br /><em>en la app.</em></h1><p className="download-lead">Esta es la versión instalada en tu teléfono. Comparte el enlace de descarga con quien quieras: {apkInfo.pageUrl}</p><Link className="primary-link" to="/tienda">Seguir comprando <ArrowUpRight size={17} /></Link></section>

  return <section className="page-section download-page"><p className="eyebrow"><Smartphone size={14} /> APP ANDROID / {apkInfo.version}</p><h1>VOKTER en<br /><em>tu bolsillo.</em></h1><p className="download-lead">La misma tienda, instalada en tu teléfono: navegación con pestañas, carrito y puntos que se guardan en el dispositivo, y pantalla completa sin barra del navegador.</p><div className="download-grid"><div className="download-card"><a className="primary-link download-button" href={apkInfo.apkUrl} download>Descargar APK <Download size={17} /></a><dl className="download-meta"><div><dt>Versión</dt><dd>{apkInfo.version}</dd></div><div><dt>Tamaño</dt><dd>{apkInfo.size}</dd></div><div><dt>Requiere</dt><dd>{apkInfo.requires}</dd></div></dl><p className="points-hint"><ShieldCheck size={14} /> Build de evaluación firmada con la clave de depuración de Android. No pide permisos aparte de Internet.</p></div><figure className="download-qr"><img src="app-qr.svg" alt={`Código QR que abre ${apkInfo.apkUrl}`} width={296} height={296} /><figcaption>Escanea con la cámara de tu Android</figcaption></figure></div><ol className="download-steps">{steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step.title}</strong><p>{step.text}</p></li>)}</ol></section>
}
