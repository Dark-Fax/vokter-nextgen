import { Capacitor } from '@capacitor/core'
import { ArrowUpRight, BadgeCheck, Download, ShieldCheck, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apkInfo } from '../data/app'

const steps = [
  { title: 'Descarga el archivo', text: 'Toca "Descargar APK" desde tu teléfono o escanea el código QR con la cámara.' },
  { title: 'Permite la instalación', text: 'Android te pedirá autorizar la instalación desde el navegador ("Instalar apps desconocidas"). Es un paso normal para apps que no vienen de Play Store. Si después de dar el permiso el instalador se cierra, abre otra vez el archivo desde Descargas.' },
  { title: 'Abre VOKTER', text: 'Instala, abre la app y compra con tu carrito, favoritos y puntos guardados en el teléfono.' },
]

const troubleshooting = [
  { question: 'Sale "App peligrosa" o "App no reconocida" (Play Protect)', answer: 'Google Play Protect avisa de toda app que no viene de Play Store. Toca "Más detalles" y luego "Instalar de todos modos". Si ofrece enviar la app para análisis, puedes aceptar o no: no cambia la instalación.' },
  { question: 'El instalador se cierra solo', answer: 'Casi siempre pasa justo después de dar el permiso "Instalar apps desconocidas": vuelve a Descargas y abre el archivo otra vez. Si ya tenías la versión 1.0 de VOKTER, desinstálala primero: la versión 1.1 tiene otra firma y Android no la instala encima.' },
  { question: 'Samsung: "Bloqueado por Auto Blocker"', answer: 'En Ajustes > Seguridad y privacidad > Auto Blocker (Bloqueo automático), desactívalo mientras instalas y vuelve a activarlo después.' },
  { question: 'No pasa nada al tocar el archivo', answer: 'Descarga el APK desde Chrome u otro navegador, no desde la vista previa interna de WhatsApp, Instagram o Facebook: esas vistas a veces no permiten instalar.' },
]

export function DownloadPage() {
  if (Capacitor.isNativePlatform()) return <section className="page-section download-page"><div className="empty-icon"><BadgeCheck size={24} /></div><p className="eyebrow">APP VOKTER / {apkInfo.version}</p><h1>Ya estás<br /><em>en la app.</em></h1><p className="download-lead">Esta es la versión instalada en tu teléfono. Comparte el enlace de descarga con quien quieras: {apkInfo.pageUrl}</p><Link className="primary-link" to="/tienda">Seguir comprando <ArrowUpRight size={17} /></Link></section>

  return <section className="page-section download-page"><p className="eyebrow"><Smartphone size={14} /> APP ANDROID / {apkInfo.version}</p><h1>VOKTER en<br /><em>tu bolsillo.</em></h1><p className="download-lead">La misma tienda, instalada en tu teléfono: navegación con pestañas, carrito y puntos que se guardan en el dispositivo, y pantalla completa sin barra del navegador.</p><div className="download-grid"><div className="download-card"><a className="primary-link download-button" href={apkInfo.apkUrl} download>Descargar APK <Download size={17} /></a><dl className="download-meta"><div><dt>Versión</dt><dd>{apkInfo.version}</dd></div><div><dt>Tamaño</dt><dd>{apkInfo.size}</dd></div><div><dt>Requiere</dt><dd>{apkInfo.requires}</dd></div></dl><p className="points-hint"><ShieldCheck size={14} /> Firmada por VOKTER. Como no viene de Play Store, Android puede mostrar un aviso de app desconocida. No pide permisos aparte de Internet.</p></div><figure className="download-qr"><img src="app-qr.svg" alt={`Código QR que abre ${apkInfo.apkUrl}`} width={296} height={296} /><figcaption>Escanea con la cámara de tu Android</figcaption></figure></div><ol className="download-steps">{steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step.title}</strong><p>{step.text}</p></li>)}</ol><div className="download-help"><p className="eyebrow">¿PROBLEMAS AL INSTALAR?</p>{troubleshooting.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
}
