'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── SCENE DURATIONS (ms) ─── total ~30s loop */
const DURATIONS = [3800, 2200, 3000, 3600, 3800, 4800, 2600, 4800]
const TOTAL = DURATIONS.reduce((a, b) => a + b, 0)

/* ─── MATH ─── */
const lerp   = (a, b, t) => a + (b - a) * t
const clamp  = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const easeIO = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

/* ─── PARTICLES ─── */
const N = 1000

function genTshirt() {
  const out = []
  let tries = 0
  while (out.length / 3 < N && tries < N * 60) {
    tries++
    const x = (Math.random() - 0.5) * 4.4
    const y = (Math.random() - 0.5) * 3.6
    const body   = Math.abs(x) < 0.88 && y >= -1.55 && y < 0.5
    const sleeve = Math.abs(x) >= 0.82 && Math.abs(x) < 2.05 && y >= -0.06 && y < 0.6
    if (body || sleeve) out.push(x, y, (Math.random() - 0.5) * 0.2)
  }
  while (out.length / 3 < N) out.push(0, 0, 0)
  return new Float32Array(out.slice(0, N * 3))
}
function genScattered() {
  const a = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const ang = Math.random() * Math.PI * 2
    const r   = 2 + Math.random() * 4.5
    a[i*3]   = Math.cos(ang) * r
    a[i*3+1] = (Math.random() - 0.5) * 5
    a[i*3+2] = Math.sin(ang) * r * 0.5
  }
  return a
}

/* ─── NOISE ─── */
function makeNoise() {
  if (typeof window === 'undefined') return null
  const c = document.createElement('canvas'); c.width = 256; c.height = 256
  return c
}
function paintNoise(canvas, heavy) {
  const ctx = canvas.getContext('2d')
  const id  = ctx.createImageData(256, 256)
  for (let i = 0; i < id.data.length; i += 4) {
    const v = heavy ? (Math.random() < 0.5 ? Math.floor(Math.random() * 85) : 0) : Math.floor(Math.random() * 20)
    const a = heavy ? (Math.random() < 0.5 ? 170 + Math.random() * 80 : 0) : 25
    id.data[i]=v; id.data[i+1]=v; id.data[i+2]=v; id.data[i+3]=a
  }
  ctx.putImageData(id, 0, 0)
}

/* ─── CAMERA POSITIONS ─── */
const CAM = [
  [0, 0.3, 8.5],     // 0 CRT TV
  [0, 0.05, 0.55],   // 1 zoom in
  [0, 0.1, 8],       // 2 bedroom
  [0, 0.3, 6],       // 3 cassette
  [0, 0,   5.5],     // 4 particles
  [0, 0,   4.8],     // 5 t-shirt
  [0.3, 0.1, 2.2],   // 6 close-up
  [0, 0,   4.8],     // 7 final
]

/* ═══ THREE.JS COMPONENTS ═══ */

function CameraRig({ scene }) {
  const { camera } = useThree()
  const tgt = useRef(new THREE.Vector3(...CAM[0]))
  const sc  = useRef(scene)
  useEffect(() => { sc.current = scene }, [scene])
  useFrame((_, dt) => {
    const s = clamp(sc.current, 0, CAM.length - 1)
    tgt.current.set(...CAM[s])
    camera.position.lerp(tgt.current, dt * (s === 1 ? 3.5 : 2.0))
    camera.lookAt(0, 0, 0)
  })
  return null
}

function CRTTV({ scene }) {
  const screenRef = useRef()
  const nc = useRef(null)
  const nt = useRef(null)
  const fr = useRef(0)
  useEffect(() => {
    nc.current = makeNoise()
    if (!nc.current) return
    paintNoise(nc.current, true)
    nt.current = new THREE.CanvasTexture(nc.current)
  }, [])
  useFrame(() => {
    if (!screenRef.current || !nc.current || !nt.current) return
    fr.current++
    if (fr.current % 2 !== 0) return
    paintNoise(nc.current, scene === 0)
    nt.current.needsUpdate = true
    const mat = screenRef.current.material
    if (!mat.emissiveMap) { mat.emissiveMap = nt.current; mat.needsUpdate = true }
    mat.emissiveIntensity = scene === 0 ? 0.7 + Math.random() * 0.9 : 0.12 + Math.random() * 0.08
  })
  if (scene > 1) return null
  return (
    <group>
      <mesh>
        <boxGeometry args={[4.4, 3.6, 1.9]} />
        <meshStandardMaterial color="#1b1b1b" roughness={0.88} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.06, 0.8]}>
        <boxGeometry args={[3.7, 3.0, 0.25]} />
        <meshStandardMaterial color="#121212" roughness={0.95} />
      </mesh>
      <mesh ref={screenRef} position={[0, 0.06, 0.94]}>
        <planeGeometry args={[3.2, 2.5]} />
        <meshStandardMaterial color="#000306" emissive="#003a18" emissiveIntensity={0.8} roughness={0} />
      </mesh>
      {[-1.35, 1.35].map((x, i) => (
        <mesh key={i} position={[x, -2.4, 0.1]}>
          <boxGeometry args={[0.38, 0.95, 0.38]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[1.7, -1.55, 0.97]}>
        <circleGeometry args={[0.045, 16]} />
        <meshStandardMaterial emissive="#00ff44" emissiveIntensity={3} color="#002200" />
      </mesh>
    </group>
  )
}

function Cassette({ scene }) {
  const grp = useRef()
  const vel = useRef(0)
  const done = useRef(false)
  useEffect(() => {
    if (scene === 3 && grp.current) {
      grp.current.position.set(0, 4, 0)
      grp.current.rotation.set(0, 0, 0)
      vel.current = 0; done.current = false
    }
  }, [scene])
  useFrame((_, dt) => {
    if (scene !== 3 || !grp.current || done.current) return
    vel.current -= dt * 2.2
    grp.current.position.y += vel.current
    grp.current.rotation.z += dt * 0.5
    if (grp.current.position.y < -0.4) { done.current = true; grp.current.position.y = -0.4 }
  })
  if (scene !== 3 && scene !== 4) return null
  return (
    <group ref={grp} position={[0, 4, 0]}>
      <mesh>
        <boxGeometry args={[1.55, 1.0, 0.3]} />
        <meshStandardMaterial color="#1a082e" roughness={0.55} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[1.25, 0.65, 0.01]} />
        <meshStandardMaterial color="#c8a96e" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.04, 0.165]}>
        <boxGeometry args={[0.78, 0.35, 0.01]} />
        <meshStandardMaterial color="#080808" roughness={0} metalness={0.7} transparent opacity={0.88} />
      </mesh>
      {[-0.24, 0.24].map((x, i) => (
        <mesh key={i} position={[x, 0.04, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.105, 0.105, 0.02, 20]} />
          <meshStandardMaterial color="#999" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Particles({ phase }) {
  const pts  = useRef()
  const prog = useRef(0)
  const { geo, tshirtPos, scattered } = useMemo(() => {
    const tshirtPos = genTshirt()
    const scattered = genScattered()
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(scattered), 3))
    return { geo, tshirtPos, scattered }
  }, [])
  const phRef = useRef(phase)
  useEffect(() => {
    phRef.current = phase
    if (phase === 0) prog.current = 0 // reset on loop
  }, [phase])
  useFrame((_, dt) => {
    if (!pts.current) return
    const p  = phRef.current
    const pa = geo.attributes.position
    if (p === 1) {
      prog.current = clamp(prog.current + dt * 0.7, 0, 1)
      const t = easeIO(prog.current)
      for (let i = 0; i < N * 3; i++) pa.array[i] = lerp(scattered[i], tshirtPos[i], t)
      pa.needsUpdate = true
    }
    if (p === 3 || p === 4) pts.current.rotation.y += dt * 0.4
    if (p === 5)             pts.current.rotation.y += dt * 0.07
    if (p === 0) {
      // re-scatter on loop restart
      for (let i = 0; i < N * 3; i++) pa.array[i] = scattered[i]
      pa.needsUpdate = true
    }
  })
  if (phase < 0) return null
  return (
    <points ref={pts} geometry={geo}>
      <pointsMaterial size={phase >= 4 ? 0.055 : 0.036} color="#c8a96e" transparent opacity={0.9} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function Scene3D({ scene, particlePhase }) {
  return (
    <>
      <CameraRig scene={scene} />
      <ambientLight intensity={0.12} color="#0f0618" />
      <pointLight position={[-5, 4, 5]}  intensity={1.4} color="#ff7322" />
      <pointLight position={[ 5, 4, 5]}  intensity={1.0} color="#5522ff" />
      <pointLight position={[ 0, 0, 3]}  intensity={scene >= 4 ? 4 : 0.7} color="#c8a96e" distance={9} />
      {scene <= 1 && <pointLight position={[0, 0.06, 1.8]} intensity={5} color="#00ff88" distance={4} />}
      <CRTTV scene={scene} />
      <Cassette scene={scene} />
      <Particles phase={particlePhase} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#060606" roughness={1} />
      </mesh>
    </>
  )
}

/* ═══ HTML OVERLAYS ═══ */

function VHSLayer({ scene, glitch }) {
  return (
    <>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:10,
        backgroundImage:'repeating-linear-gradient(0deg,rgba(0,0,0,0.12) 0px,rgba(0,0,0,0.12) 1px,transparent 1px,transparent 3px)',
        backgroundSize:'100% 3px' }} />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:11,
        background:'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.82) 100%)' }} />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:12, opacity:0.16,
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:'200px 200px', mixBlendMode:'overlay' }} />
      {scene <= 1 && (
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:9,
          background:'radial-gradient(ellipse 60% 45% at 50% 52%, rgba(0,255,110,0.05) 0%, transparent 100%)',
          mixBlendMode:'screen' }} />
      )}
      {glitch && [
        { top:`${15+Math.random()*45}%`, h:`${2+Math.random()*9}px`, color:'rgba(255,0,88,0.65)', tx:`${(Math.random()-.5)*55}px` },
        { top:`${40+Math.random()*30}%`, h:`${1+Math.random()*4}px`, color:'rgba(0,200,255,0.55)', tx:`${(Math.random()-.5)*70}px` },
      ].map((g,i)=>(
        <div key={i} style={{ position:'absolute', left:0, right:0, pointerEvents:'none', zIndex:22,
          top:g.top, height:g.h, background:g.color, transform:`translateX(${g.tx})`, mixBlendMode:'screen' }} />
      ))}
    </>
  )
}

function TVText({ scene }) {
  if (scene !== 0) return null
  return (
    <div style={{ position:'absolute', inset:0, zIndex:14, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
      <div style={{ fontFamily:'monospace', fontSize:'clamp(1.6rem,4vw,4rem)', color:'#00ff88',
        letterSpacing:'0.35em', textShadow:'0 0 18px #00ff88, 0 0 45px #00cc66, 0 0 80px #006633',
        animation:'flicker 0.12s infinite', userSelect:'none' }}>late90s</div>
      <div style={{ fontFamily:'monospace', fontSize:'clamp(0.4rem,1vw,0.75rem)', color:'#00aa55',
        letterSpacing:'0.55em', marginTop:'0.5rem', opacity:0.6, animation:'flicker 0.18s infinite' }}>
        ▓▓ SIGNAL DETECTED ▓▓
      </div>
    </div>
  )
}

function BedroomLayer({ visible }) {
  if (!visible) return null
  return (
    <div style={{ position:'absolute', inset:0, zIndex:5,
      background:'linear-gradient(160deg, #0c0015 0%, #1a0608 45%, #090808 100%)', overflow:'hidden' }}>
      <div style={{ position:'absolute', width:'45vw', height:'45vw', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(255,90,0,0.22) 0%, transparent 70%)', top:'-8%', right:'-5%' }} />
      <div style={{ position:'absolute', width:'50vw', height:'50vw', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(90,0,200,0.18) 0%, transparent 70%)', bottom:'-10%', left:'-8%' }} />
      <div style={{ position:'absolute', top:'10%', left:'7%',
        width:'clamp(65px,8.5vw,120px)', height:'clamp(95px,12vw,165px)',
        background:'linear-gradient(135deg,#1a0838,#2c0a1a)', border:'2px solid rgba(200,169,110,0.35)',
        transform:'rotate(-3deg)', boxShadow:'5px 5px 20px rgba(0,0,0,0.9)',
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontFamily:'monospace', fontSize:'clamp(0.45rem,0.95vw,0.75rem)', color:'#c8a96e', textAlign:'center', lineHeight:1.5 }}>LATE<br/>90S<br/>★</span>
      </div>
      <div style={{ position:'absolute', top:'8%', right:'10%',
        width:'clamp(55px,7.5vw,105px)', height:'clamp(80px,10.5vw,145px)',
        background:'linear-gradient(135deg,#1a1a02,#2a1800)', border:'2px solid rgba(255,90,0,0.3)',
        transform:'rotate(2.5deg)', boxShadow:'5px 5px 20px rgba(0,0,0,0.9)' }} />
      <div style={{ position:'absolute', bottom:'14%', left:'18%', display:'flex', gap:'0.4rem' }}>
        {[0,1].map(i=>(
          <div key={i} style={{ width:'clamp(36px,5vw,68px)', height:'clamp(17px,2.3vw,32px)',
            background:'linear-gradient(to top,#181818,#282828)', border:'1px solid rgba(200,169,110,0.18)',
            borderRadius:'2px 10px 2px 2px', transform:`rotate(${i*14-4}deg)` }} />
        ))}
      </div>
      <div style={{ position:'absolute', bottom:'17%', right:'15%', display:'flex', flexDirection:'column', gap:'3px' }}>
        {['#c8a96e','#2a0a45','#1a2a08'].map((c,i)=>(
          <div key={i} style={{ width:'clamp(40px,5vw,65px)', height:'clamp(12px,1.6vw,20px)',
            background:c, opacity:0.85, transform:`rotate(${(i-1)*6}deg)`, border:'1px solid rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <div style={{ position:'absolute', top:'6%', left:'50%', transform:'translateX(-50%)',
        fontFamily:'monospace', fontSize:'clamp(0.45rem,1.1vw,0.75rem)',
        color:'rgba(200,169,110,0.5)', letterSpacing:'0.5em', animation:'flicker 0.2s infinite' }}>
        ▶ PLAYING
      </div>
    </div>
  )
}

function RetroHUD({ visible }) {
  if (!visible) return null
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:15 }}>
      <div style={{ position:'absolute', top:'13%', left:'7%',
        border:'1px solid rgba(200,169,110,0.65)', padding:'0.5rem 0.9rem',
        background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)' }}>
        <div style={{ fontFamily:'monospace', fontSize:'clamp(0.4rem,0.8vw,0.62rem)', color:'#c8a96e', letterSpacing:'0.25em' }}>◆ NEW DROP</div>
        <div style={{ fontFamily:'monospace', fontSize:'clamp(0.85rem,1.7vw,1.2rem)', color:'#fff', letterSpacing:'0.08em', marginTop:'0.2rem' }}>LKR 2,500</div>
      </div>
      <div style={{ position:'absolute', bottom:'20%', left:'7%',
        border:'1px solid rgba(255,255,255,0.18)', padding:'0.4rem 0.85rem', background:'rgba(0,0,0,0.4)' }}>
        <div style={{ fontFamily:'monospace', fontSize:'clamp(0.36rem,0.72vw,0.56rem)', color:'rgba(255,255,255,0.45)', letterSpacing:'0.28em' }}>OVERSIZED FIT</div>
        <div style={{ fontFamily:'monospace', fontSize:'clamp(0.42rem,0.8vw,0.62rem)', color:'rgba(255,255,255,0.75)', letterSpacing:'0.18em', marginTop:'0.12rem' }}>S / M / L / XL</div>
      </div>
      <div style={{ position:'absolute', top:'13%', right:'7%',
        width:'clamp(36px,4.8vw,55px)', height:'clamp(36px,4.8vw,55px)', borderRadius:'50%',
        border:'2px solid #c8a96e', display:'flex', alignItems:'center', justifyContent:'center',
        background:'rgba(0,0,0,0.5)', fontSize:'clamp(1rem,2vw,1.6rem)', color:'#c8a96e' }}>☻</div>
      <div style={{ position:'absolute', bottom:'20%', right:'7%',
        fontFamily:'monospace', fontSize:'clamp(0.38rem,0.74vw,0.58rem)',
        color:'rgba(200,169,110,0.55)', letterSpacing:'0.32em' }}>LATE90S ™</div>
      {[
        { top:'9%', left:'4%', borderTop:'2px solid rgba(200,169,110,0.4)', borderLeft:'2px solid rgba(200,169,110,0.4)' },
        { top:'9%', right:'4%', borderTop:'2px solid rgba(200,169,110,0.4)', borderRight:'2px solid rgba(200,169,110,0.4)' },
        { bottom:'9%', left:'4%', borderBottom:'2px solid rgba(200,169,110,0.4)', borderLeft:'2px solid rgba(200,169,110,0.4)' },
        { bottom:'9%', right:'4%', borderBottom:'2px solid rgba(200,169,110,0.4)', borderRight:'2px solid rgba(200,169,110,0.4)' },
      ].map((s,i)=>(
        <div key={i} style={{ position:'absolute', width:'clamp(20px,2.8vw,36px)', height:'clamp(20px,2.8vw,36px)', ...s }} />
      ))}
    </div>
  )
}

function FinalOverlay({ visible }) {
  const [p, setP] = useState(0)
  useEffect(() => {
    if (!visible) { setP(0); return }
    const t1 = setTimeout(() => setP(1), 600)
    const t2 = setTimeout(() => setP(2), 1700)
    const t3 = setTimeout(() => setP(3), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [visible])
  return (
    <>
      <div style={{ position:'absolute', inset:0, zIndex:8, pointerEvents:'none',
        background: visible ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)', transition:'background 1.2s ease' }} />
      <div style={{ position:'absolute', inset:0, zIndex:17, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', pointerEvents: p >= 3 ? 'auto' : 'none',
        opacity: visible ? 1 : 0, transition:'opacity 0.6s ease' }}>
        <div style={{ fontFamily:'monospace', fontSize:'clamp(2.5rem,8vw,7.5rem)', color:'#fff',
          letterSpacing:'0.18em',
          textShadow: p >= 1 ? '0 0 30px rgba(200,169,110,0.85), 0 0 70px rgba(200,169,110,0.4)' : 'none',
          opacity: p >= 1 ? 1 : 0, transform: p >= 1 ? 'translateY(0)' : 'translateY(24px)',
          transition:'all 1s cubic-bezier(0.16,1,0.3,1)',
          animation: p >= 1 ? 'glitch 3.5s infinite' : 'none' }}>late90s</div>
        <div style={{ fontFamily:'monospace', fontSize:'clamp(0.48rem,1.3vw,0.9rem)',
          color:'rgba(200,169,110,0.9)', letterSpacing:'0.38em', textTransform:'uppercase', marginTop:'1rem',
          opacity: p >= 2 ? 1 : 0, transform: p >= 2 ? 'translateY(0)' : 'translateY(12px)',
          transition:'all 0.9s ease 0.1s' }}>
          PAST IS THE VIBE. FUTURE IS THE DROP.
        </div>
        <div style={{ width: p >= 2 ? '190px' : '0px', height:'1px',
          background:'linear-gradient(to right,transparent,#c8a96e,transparent)', margin:'2rem 0',
          transition:'width 1.1s ease' }} />
        <a href="/products" style={{ textDecoration:'none' }}>
          <div style={{ fontFamily:'monospace', fontSize:'clamp(0.9rem,2.5vw,1.8rem)', color:'#000',
            background:'#c8a96e', padding:'clamp(0.6rem,1.3vw,1rem) clamp(1.6rem,4vw,3.5rem)',
            letterSpacing:'0.32em', fontWeight:'900', cursor:'pointer',
            opacity: p >= 3 ? 1 : 0, transform: p >= 3 ? 'scale(1)' : 'scale(0.75)',
            transition:'all 0.7s cubic-bezier(0.16,1,0.3,1)',
            boxShadow:'0 0 35px rgba(200,169,110,0.55), 0 0 90px rgba(200,169,110,0.2)' }}>
            SHOP NOW
          </div>
        </a>
      </div>
    </>
  )
}

/* ─── PROGRESS DOTS ─── */
function Dots({ scene }) {
  return (
    <div style={{ position:'absolute', bottom:'1.25rem', left:'50%', transform:'translateX(-50%)',
      display:'flex', gap:'0.4rem', zIndex:20, pointerEvents:'none' }}>
      {DURATIONS.map((_, i) => (
        <div key={i} style={{ width: i === scene ? '20px' : '5px', height:'3px',
          background: i <= scene ? 'rgba(200,169,110,0.8)' : 'rgba(255,255,255,0.12)',
          transition:'all 0.4s ease', borderRadius:'1.5px' }} />
      ))}
    </div>
  )
}

/* ─── REC STAMP ─── */
function RecStamp({ scene }) {
  return (
    <div style={{ position:'absolute', top:'1.25rem', left:'1.75rem', fontFamily:'monospace',
      fontSize:'clamp(0.45rem,0.85vw,0.68rem)', color:'rgba(255,255,255,0.32)', letterSpacing:'0.12em',
      zIndex:20, pointerEvents:'none' }}>
      <span style={{ color:'rgba(255,80,80,0.75)' }}>⏺ REC</span>
      {'  LATE90S.LK'}
    </div>
  )
}

/* ═══ MAIN COMPONENT ═══ */
export default function PromoLoop() {
  const [scene,   setScene]   = useState(0)
  const [glitch,  setGlitch]  = useState(false)
  const [mounted, setMounted] = useState(false)
  const loopRef = useRef(null)

  useEffect(() => { setMounted(true) }, [])

  /* Scene timer — loops forever */
  const startLoop = () => {
    let total = 0
    const timers = DURATIONS.map((dur, i) => {
      const t = setTimeout(() => {
        const nextScene = i + 1
        setScene(nextScene)
        setGlitch(true)
        setTimeout(() => setGlitch(false), 300)

        // After last scene, restart
        if (nextScene >= DURATIONS.length) {
          setTimeout(() => {
            setScene(0)
            setGlitch(true)
            setTimeout(() => setGlitch(false), 400)
          }, DURATIONS[DURATIONS.length - 1])
        }
      }, total += dur)
      return t
    })
    loopRef.current = timers
    return timers
  }

  useEffect(() => {
    if (!mounted) return
    const timers = startLoop()

    // Restart loop every full cycle
    const loopInterval = setInterval(() => {
      timers.forEach(clearTimeout)
      setScene(0)
      startLoop()
    }, TOTAL + 500)

    return () => {
      timers.forEach(clearTimeout)
      clearInterval(loopInterval)
    }
  }, [mounted])

  /* Micro glitches */
  useEffect(() => {
    if (!mounted) return
    const id = setInterval(() => {
      if (Math.random() < 0.16) {
        setGlitch(true)
        setTimeout(() => setGlitch(false), 60 + Math.random() * 150)
      }
    }, 2000)
    return () => clearInterval(id)
  }, [mounted])

  const particlePhase = useMemo(() => {
    if (scene === 3) return 0
    if (scene === 4) return 1
    if (scene === 5) return 3
    if (scene === 6) return 4
    if (scene === 7) return 5
    return -1
  }, [scene])

  if (!mounted) return (
    <section style={{ height:'100vh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily:'monospace', color:'rgba(200,169,110,0.3)', letterSpacing:'0.5em', fontSize:'0.7rem' }}>
        LOADING...
      </div>
    </section>
  )

  return (
    <section style={{ position:'relative', width:'100%', height:'100vh', overflow:'hidden', background:'#000' }}>
      <style>{`
        @keyframes flicker {
          0%,100%{opacity:1} 33%{opacity:0.72} 66%{opacity:0.9} 80%{opacity:0.48}
        }
        @keyframes glitch {
          0%,82%,100%{transform:translateX(0) skewX(0);filter:none}
          83%{transform:translateX(-5px) skewX(-2deg);filter:drop-shadow(4px 0 #ff0066) drop-shadow(-4px 0 #00ffee)}
          84%{transform:translateX(5px) skewX(1.5deg);filter:drop-shadow(-3px 0 #ff0066) drop-shadow(3px 0 #00ffee)}
          85%{transform:translateX(0) skewX(0);filter:none}
          91%{transform:translateX(-2px);filter:drop-shadow(2px 0 #ff0066)}
          92%{transform:translateX(0);filter:none}
        }
        @keyframes sweep {
          0%{top:-1%} 100%{top:101%}
        }
      `}</style>

      {/* Three.js canvas */}
      <Canvas
        shadows
        gl={{ antialias:true, alpha:false, toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:1.2 }}
        style={{ position:'absolute', inset:0 }}
        camera={{ position:[0, 0.3, 8.5], fov:60, near:0.01, far:120 }}
      >
        <Scene3D scene={scene} particlePhase={particlePhase} />
      </Canvas>

      {/* HTML layers */}
      <BedroomLayer visible={scene === 2} />
      <TVText scene={scene} />
      <RetroHUD visible={scene === 5 || scene === 6} />
      <FinalOverlay visible={scene === 7} />
      <VHSLayer scene={scene} glitch={glitch} />

      {/* Sweep line */}
      <div style={{ position:'absolute', left:0, right:0, height:'3px', pointerEvents:'none', zIndex:13,
        background:'linear-gradient(to right,transparent,rgba(200,169,110,0.07),transparent)',
        animation:'sweep 9s linear infinite' }} />

      {/* Chrome */}
      <RecStamp scene={scene} />
      <Dots scene={Math.min(scene, 7)} />

      {/* Chromatic glitch flash */}
      {glitch && (
        <div style={{ position:'absolute', inset:0, zIndex:21, pointerEvents:'none',
          filter:'drop-shadow(3px 0 rgba(255,0,80,0.3)) drop-shadow(-3px 0 rgba(0,200,255,0.3))',
          mixBlendMode:'screen' }} />
      )}
    </section>
  )
}
