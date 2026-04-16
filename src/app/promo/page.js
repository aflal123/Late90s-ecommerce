'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ─────────────────────────────────────────────────────────────
   SCENE TIMING  (ms each scene lasts)
───────────────────────────────────────────────────────────── */
const DURATIONS = [4200, 2600, 3400, 4000, 4200, 5200, 3000, 8000]

/* ─────────────────────────────────────────────────────────────
   MATH
───────────────────────────────────────────────────────────── */
const lerp   = (a, b, t) => a + (b - a) * t
const clamp  = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const easeIO = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

/* ─────────────────────────────────────────────────────────────
   PARTICLE POSITIONS
───────────────────────────────────────────────────────────── */
const N = 1100

function genTshirt() {
  const out = []
  let tries = 0
  while (out.length / 3 < N && tries < N * 60) {
    tries++
    const x = (Math.random() - 0.5) * 4.6
    const y = (Math.random() - 0.5) * 3.8
    const body   = Math.abs(x) < 0.9  && y >= -1.6 && y < 0.52
    const sleeve = Math.abs(x) >= 0.84 && Math.abs(x) < 2.1 && y >= -0.06 && y < 0.62
    if (body || sleeve) out.push(x, y, (Math.random() - 0.5) * 0.22)
  }
  while (out.length / 3 < N) out.push(0, 0, 0)
  return new Float32Array(out.slice(0, N * 3))
}

function genScattered() {
  const a = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const ang = Math.random() * Math.PI * 2
    const r   = 2.2 + Math.random() * 4.5
    a[i*3]   = Math.cos(ang) * r
    a[i*3+1] = (Math.random() - 0.5) * 5.5
    a[i*3+2] = Math.sin(ang) * r * 0.55
  }
  return a
}

/* ─────────────────────────────────────────────────────────────
   CRT NOISE CANVAS
───────────────────────────────────────────────────────────── */
function makeNoiseCanvas() {
  if (typeof window === 'undefined') return null
  const c = document.createElement('canvas')
  c.width = 256; c.height = 256
  return c
}
function paintNoise(canvas, heavy) {
  const ctx = canvas.getContext('2d')
  const id  = ctx.createImageData(256, 256)
  for (let i = 0; i < id.data.length; i += 4) {
    const v = heavy
      ? (Math.random() < 0.55 ? Math.floor(Math.random() * 90) : 0)
      : Math.floor(Math.random() * 22)
    const a = heavy
      ? (Math.random() < 0.5 ? 180 + Math.random() * 70 : 0)
      : 28
    id.data[i] = v; id.data[i+1] = v; id.data[i+2] = v; id.data[i+3] = a
  }
  ctx.putImageData(id, 0, 0)
}

/* ─────────────────────────────────────────────────────────────
   CAMERA TARGETS
───────────────────────────────────────────────────────────── */
const CAM = [
  [0, 0.3, 8.5],    // 0 – wide TV shot
  [0, 0.05, 0.6],   // 1 – zoom into screen
  [0, 0.1, 8],      // 2 – bedroom (HTML)
  [0, 0.3, 6],      // 3 – cassette falls
  [0, 0,   5.5],    // 4 – particles converge
  [0, 0,   4.8],    // 5 – T-shirt rotates
  [0.25, 0.1, 2.4], // 6 – fabric close-up
  [0, 0,   4.8],    // 7 – final freeze
]

/* ═══════════════════════════════════════════════════════════
   THREE.JS COMPONENTS
═══════════════════════════════════════════════════════════ */

/* Camera */
function CameraRig({ scene }) {
  const { camera } = useThree()
  const tgt = useRef(new THREE.Vector3(...CAM[0]))
  const scRef = useRef(scene)
  useEffect(() => { scRef.current = scene }, [scene])
  useFrame((_, dt) => {
    const s = clamp(scRef.current, 0, CAM.length - 1)
    tgt.current.set(...CAM[s])
    camera.position.lerp(tgt.current, dt * (s === 1 ? 3.5 : 2.0))
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* CRT Television */
function CRTTV({ scene }) {
  const screenRef   = useRef()
  const noiseCanvas = useRef(null)
  const noiseTex    = useRef(null)
  const frame       = useRef(0)

  useEffect(() => {
    noiseCanvas.current = makeNoiseCanvas()
    if (!noiseCanvas.current) return
    paintNoise(noiseCanvas.current, true)
    noiseTex.current = new THREE.CanvasTexture(noiseCanvas.current)
  }, [])

  useFrame(() => {
    if (!screenRef.current || !noiseCanvas.current || !noiseTex.current) return
    frame.current++
    if (frame.current % 2 !== 0) return

    paintNoise(noiseCanvas.current, scene === 0)
    noiseTex.current.needsUpdate = true

    const mat = screenRef.current.material
    if (!mat.emissiveMap) {
      mat.emissiveMap = noiseTex.current
      mat.needsUpdate = true
    }
    mat.emissiveIntensity = scene === 0
      ? 0.7 + Math.random() * 0.9
      : 0.15 + Math.random() * 0.1
  })

  if (scene > 1) return null

  return (
    <group>
      {/* Outer shell */}
      <mesh castShadow>
        <boxGeometry args={[4.4, 3.6, 1.9]} />
        <meshStandardMaterial color="#1b1b1b" roughness={0.88} metalness={0.08} />
      </mesh>
      {/* Inner bezel */}
      <mesh position={[0, 0.06, 0.8]}>
        <boxGeometry args={[3.7, 3.0, 0.25]} />
        <meshStandardMaterial color="#121212" roughness={0.95} />
      </mesh>
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0.06, 0.94]}>
        <planeGeometry args={[3.2, 2.5]} />
        <meshStandardMaterial
          color="#000306"
          emissive="#003a18"
          emissiveIntensity={0.8}
          roughness={0}
          metalness={0}
        />
      </mesh>
      {/* Screen glass glare */}
      <mesh position={[-0.5, 0.7, 0.95]}>
        <planeGeometry args={[0.7, 0.15]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.025} roughness={0} />
      </mesh>
      {/* Legs */}
      {[-1.35, 1.35].map((x, i) => (
        <mesh key={i} position={[x, -2.4, 0.1]}>
          <boxGeometry args={[0.38, 0.95, 0.38]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      ))}
      {/* Power LED */}
      <mesh position={[1.7, -1.55, 0.97]}>
        <circleGeometry args={[0.045, 16]} />
        <meshStandardMaterial emissive="#00ff44" emissiveIntensity={3} color="#002200" />
      </mesh>
    </group>
  )
}

/* Cassette Tape */
function Cassette({ scene }) {
  const grp = useRef()
  const vel = useRef(0)
  const done = useRef(false)

  useEffect(() => {
    if (scene === 3 && grp.current) {
      grp.current.position.set(0, 4, 0)
      grp.current.rotation.set(0, 0, 0)
      vel.current = 0
      done.current = false
    }
  }, [scene])

  useFrame((_, dt) => {
    if (scene !== 3 || !grp.current || done.current) return
    vel.current -= dt * 2.2
    grp.current.position.y += vel.current
    grp.current.rotation.z += dt * 0.5
    if (grp.current.position.y < -0.4) {
      done.current = true
      grp.current.position.y = -0.4
    }
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
        <meshStandardMaterial color="#c8a96e" roughness={0.75} metalness={0.1} />
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

/* Particle System — scattered → T-shirt */
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
  useEffect(() => { phRef.current = phase }, [phase])

  useFrame((_, dt) => {
    if (!pts.current) return
    const p  = phRef.current
    const pa = geo.attributes.position

    if (p === 1) {
      // converge into T-shirt
      prog.current = clamp(prog.current + dt * 0.72, 0, 1)
      const t = easeIO(prog.current)
      for (let i = 0; i < N * 3; i++)
        pa.array[i] = lerp(scattered[i], tshirtPos[i], t)
      pa.needsUpdate = true
    }

    if (p === 3 || p === 4) pts.current.rotation.y += dt * 0.38
    if (p === 5)             pts.current.rotation.y += dt * 0.06
  })

  if (phase < 0) return null

  return (
    <points ref={pts} geometry={geo}>
      <pointsMaterial
        size={phase >= 4 ? 0.058 : 0.038}
        color="#c8a96e"
        transparent
        opacity={phase >= 1 ? 0.92 : 0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* Full 3-D scene */
function Scene3D({ scene, particlePhase }) {
  return (
    <>
      <CameraRig scene={scene} />

      <ambientLight intensity={0.12} color="#0f0618" />
      <pointLight position={[-5, 4, 5]}  intensity={1.4} color="#ff7322" />
      <pointLight position={[ 5, 4, 5]}  intensity={1.0} color="#5522ff" />
      <pointLight position={[ 0, 0, 3]}  intensity={scene >= 4 ? 4 : 0.7} color="#c8a96e" distance={9} />
      {scene <= 1 && (
        <pointLight position={[0, 0.06, 1.8]} intensity={5} color="#00ff88" distance={4} />
      )}

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

/* ═══════════════════════════════════════════════════════════
   HTML OVERLAY LAYERS
═══════════════════════════════════════════════════════════ */

/* VHS effects */
function VHSLayer({ scene, glitch }) {
  return (
    <>
      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
        backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,0,0,0.13) 0px,rgba(0,0,0,0.13) 1px,transparent 1px,transparent 3px)',
        backgroundSize: '100% 3px',
      }} />
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 11,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.82) 100%)',
      }} />
      {/* Film dust */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12,
        opacity: 0.18,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        mixBlendMode: 'overlay',
      }} />
      {/* CRT glow (scenes 0-1) */}
      {scene <= 1 && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9,
          background: 'radial-gradient(ellipse 60% 45% at 50% 52%, rgba(0,255,110,0.055) 0%, transparent 100%)',
          mixBlendMode: 'screen',
        }} />
      )}
      {/* Glitch tears */}
      {glitch && [
        { top: `${15 + Math.random() * 45}%`, h: `${2 + Math.random() * 9}px`, color: 'rgba(255,0,88,0.65)', tx: `${(Math.random()-0.5)*55}px` },
        { top: `${40 + Math.random() * 30}%`, h: `${1 + Math.random() * 4}px`, color: 'rgba(0,200,255,0.55)', tx: `${(Math.random()-0.5)*70}px` },
      ].map((g, i) => (
        <div key={i} style={{
          position: 'absolute', left: 0, right: 0, pointerEvents: 'none', zIndex: 22,
          top: g.top, height: g.h,
          background: g.color,
          transform: `translateX(${g.tx})`,
          mixBlendMode: 'screen',
        }} />
      ))}
    </>
  )
}

/* Animated scan line sweep */
function ScanSweep() {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, height: '3px',
      background: 'linear-gradient(to right, transparent, rgba(200,169,110,0.07), transparent)',
      pointerEvents: 'none', zIndex: 13,
      animation: 'sweep 9s linear infinite',
    }} />
  )
}

/* TV screen text */
function TVText({ scene }) {
  if (scene !== 0) return null
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 14,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 'clamp(1.8rem, 5vw, 4.5rem)',
        color: '#00ff88',
        letterSpacing: '0.35em',
        textShadow: '0 0 18px #00ff88, 0 0 45px #00cc66, 0 0 80px #006633',
        animation: 'flicker 0.12s infinite',
        userSelect: 'none',
      }}>late90s</div>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 'clamp(0.45rem, 1.2vw, 0.85rem)',
        color: '#00aa55',
        letterSpacing: '0.55em',
        marginTop: '0.6rem',
        opacity: 0.65,
        animation: 'flicker 0.18s infinite',
      }}>▓▓ SIGNAL DETECTED ▓▓</div>
    </div>
  )
}

/* Bedroom scene */
function BedroomLayer({ visible }) {
  if (!visible) return null
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 5,
      background: 'linear-gradient(160deg, #0c0015 0%, #1a0608 45%, #090808 100%)',
      overflow: 'hidden',
    }}>
      {/* Warm lamp glow top-right */}
      <div style={{
        position: 'absolute', width: '45vw', height: '45vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,90,0,0.22) 0%, transparent 70%)',
        top: '-8%', right: '-5%', pointerEvents: 'none',
      }} />
      {/* Purple ambient bottom-left */}
      <div style={{
        position: 'absolute', width: '50vw', height: '50vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(90,0,200,0.18) 0%, transparent 70%)',
        bottom: '-10%', left: '-8%', pointerEvents: 'none',
      }} />

      {/* Poster 1 */}
      <div style={{
        position: 'absolute', top: '10%', left: '7%',
        width: 'clamp(70px,9vw,125px)', height: 'clamp(100px,13vw,175px)',
        background: 'linear-gradient(135deg,#1a0838,#2c0a1a)',
        border: '2px solid rgba(200,169,110,0.35)',
        transform: 'rotate(-3deg)',
        boxShadow: '5px 5px 20px rgba(0,0,0,0.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily:'monospace', fontSize:'clamp(0.5rem,1vw,0.8rem)', color:'#c8a96e', textAlign:'center', lineHeight:1.5 }}>LATE<br/>90S<br/>★</span>
      </div>
      {/* Poster 2 */}
      <div style={{
        position: 'absolute', top: '8%', right: '10%',
        width: 'clamp(60px,8vw,110px)', height: 'clamp(85px,11vw,150px)',
        background: 'linear-gradient(135deg,#1a1a02,#2a1800)',
        border: '2px solid rgba(255,90,0,0.3)',
        transform: 'rotate(2.5deg)',
        boxShadow: '5px 5px 20px rgba(0,0,0,0.9)',
      }} />

      {/* Sneakers */}
      <div style={{ position:'absolute', bottom:'14%', left:'18%', display:'flex', gap:'0.4rem' }}>
        {[0,1].map(i => (
          <div key={i} style={{
            width:'clamp(38px,5.5vw,72px)', height:'clamp(18px,2.5vw,34px)',
            background:'linear-gradient(to top, #181818, #282828)',
            border:'1px solid rgba(200,169,110,0.18)',
            borderRadius:'2px 10px 2px 2px',
            transform:`rotate(${i*14-4}deg)`,
            boxShadow:'2px 2px 10px rgba(0,0,0,0.8)',
          }} />
        ))}
      </div>

      {/* Cassette tapes pile */}
      <div style={{ position:'absolute', bottom:'17%', right:'15%', display:'flex', flexDirection:'column', gap:'3px' }}>
        {['#c8a96e','#2a0a45','#1a2a08'].map((c,i) => (
          <div key={i} style={{
            width:'clamp(42px,5.5vw,68px)', height:'clamp(13px,1.8vw,22px)',
            background: c, opacity:0.85,
            transform:`rotate(${(i-1)*6}deg)`,
            border:'1px solid rgba(255,255,255,0.08)',
          }} />
        ))}
      </div>

      {/* Old speaker */}
      <div style={{
        position:'absolute', bottom:'8%', left:'5%',
        width:'clamp(30px,4vw,55px)', height:'clamp(60px,8vw,110px)',
        background:'#111',
        border:'1px solid #222',
        borderRadius:'2px',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-around',
        padding:'6px 0',
      }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{ width:'70%', height:'clamp(8px,1.2vw,14px)', borderRadius:'50%', border:'1px solid #333', background:'#0a0a0a' }} />
        ))}
      </div>

      {/* REC indicator */}
      <div style={{
        position:'absolute', top:'6%', left:'50%', transform:'translateX(-50%)',
        fontFamily:'monospace', fontSize:'clamp(0.5rem,1.2vw,0.8rem)',
        color:'rgba(200,169,110,0.55)', letterSpacing:'0.5em',
        animation:'flicker 0.2s infinite',
      }}>▶ PLAYING</div>
    </div>
  )
}

/* Retro HUD overlay (scenes 5-6) */
function RetroHUD({ visible }) {
  if (!visible) return null
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:15 }}>
      {/* NEW DROP tag — top left */}
      <div style={{
        position:'absolute', top:'13%', left:'7%',
        border:'1px solid rgba(200,169,110,0.65)',
        padding:'0.55rem 1rem',
        background:'rgba(0,0,0,0.55)',
        backdropFilter:'blur(6px)',
      }}>
        <div style={{ fontFamily:'monospace', fontSize:'clamp(0.42rem,0.85vw,0.65rem)', color:'#c8a96e', letterSpacing:'0.25em' }}>◆ NEW DROP</div>
        <div style={{ fontFamily:'monospace', fontSize:'clamp(0.9rem,1.8vw,1.25rem)', color:'#fff', letterSpacing:'0.08em', marginTop:'0.2rem' }}>LKR 2,500</div>
      </div>

      {/* Size tag — bottom left */}
      <div style={{
        position:'absolute', bottom:'20%', left:'7%',
        border:'1px solid rgba(255,255,255,0.18)',
        padding:'0.45rem 0.9rem',
        background:'rgba(0,0,0,0.4)',
      }}>
        <div style={{ fontFamily:'monospace', fontSize:'clamp(0.38rem,0.75vw,0.58rem)', color:'rgba(255,255,255,0.45)', letterSpacing:'0.28em' }}>OVERSIZED FIT</div>
        <div style={{ fontFamily:'monospace', fontSize:'clamp(0.45rem,0.85vw,0.65rem)', color:'rgba(255,255,255,0.75)', letterSpacing:'0.18em', marginTop:'0.15rem' }}>S / M / L / XL</div>
      </div>

      {/* Smiley — top right */}
      <div style={{
        position:'absolute', top:'13%', right:'7%',
        width:'clamp(38px,5vw,58px)', height:'clamp(38px,5vw,58px)',
        borderRadius:'50%',
        border:'2px solid #c8a96e',
        display:'flex', alignItems:'center', justifyContent:'center',
        background:'rgba(0,0,0,0.5)',
        fontSize:'clamp(1.1rem,2.2vw,1.7rem)',
        color:'#c8a96e',
      }}>☻</div>

      {/* Brand — bottom right */}
      <div style={{
        position:'absolute', bottom:'20%', right:'7%',
        fontFamily:'monospace',
        fontSize:'clamp(0.4rem,0.78vw,0.6rem)',
        color:'rgba(200,169,110,0.55)',
        letterSpacing:'0.32em',
        textTransform:'uppercase',
      }}>LATE90S ™</div>

      {/* Corner brackets */}
      {[
        { top:'9%',    left:'4%',   borderTop:'2px solid rgba(200,169,110,0.45)', borderLeft:'2px solid rgba(200,169,110,0.45)' },
        { top:'9%',    right:'4%',  borderTop:'2px solid rgba(200,169,110,0.45)', borderRight:'2px solid rgba(200,169,110,0.45)' },
        { bottom:'9%', left:'4%',   borderBottom:'2px solid rgba(200,169,110,0.45)', borderLeft:'2px solid rgba(200,169,110,0.45)' },
        { bottom:'9%', right:'4%',  borderBottom:'2px solid rgba(200,169,110,0.45)', borderRight:'2px solid rgba(200,169,110,0.45)' },
      ].map((s,i) => (
        <div key={i} style={{ position:'absolute', width:'clamp(22px,3vw,38px)', height:'clamp(22px,3vw,38px)', ...s }} />
      ))}
    </div>
  )
}

/* Final freeze + text reveal */
function FinalLayer({ visible }) {
  const [p, setP] = useState(0)

  useEffect(() => {
    if (!visible) { setP(0); return }
    const t1 = setTimeout(() => setP(1), 700)
    const t2 = setTimeout(() => setP(2), 1900)
    const t3 = setTimeout(() => setP(3), 3400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [visible])

  return (
    <>
      {/* Darken background */}
      <div style={{
        position:'absolute', inset:0, zIndex:8, pointerEvents:'none',
        background: visible ? 'rgba(0,0,0,0.58)' : 'rgba(0,0,0,0)',
        transition:'background 1.2s ease',
      }} />

      {/* Text stack */}
      <div style={{
        position:'absolute', inset:0, zIndex:17,
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        pointerEvents: p >= 3 ? 'auto' : 'none',
        opacity: visible ? 1 : 0,
        transition:'opacity 0.6s ease',
      }}>
        {/* Brand name */}
        <div style={{
          fontFamily:'monospace',
          fontSize:'clamp(3rem, 9vw, 8rem)',
          color:'#fff',
          letterSpacing:'0.18em',
          textShadow: p >= 1 ? '0 0 30px rgba(200,169,110,0.85), 0 0 70px rgba(200,169,110,0.4)' : 'none',
          opacity: p >= 1 ? 1 : 0,
          transform: p >= 1 ? 'translateY(0)' : 'translateY(24px)',
          transition:'all 1s cubic-bezier(0.16,1,0.3,1)',
          animation: p >= 1 ? 'glitch 3.5s infinite' : 'none',
        }}>late90s</div>

        {/* Tagline */}
        <div style={{
          fontFamily:'monospace',
          fontSize:'clamp(0.5rem, 1.4vw, 0.95rem)',
          color:'rgba(200,169,110,0.9)',
          letterSpacing:'0.38em',
          textTransform:'uppercase',
          marginTop:'1rem',
          opacity: p >= 2 ? 1 : 0,
          transform: p >= 2 ? 'translateY(0)' : 'translateY(12px)',
          transition:'all 0.9s ease 0.1s',
        }}>PAST IS THE VIBE. FUTURE IS THE DROP.</div>

        {/* Gold rule */}
        <div style={{
          width: p >= 2 ? '200px' : '0px',
          height:'1px',
          background:'linear-gradient(to right, transparent, #c8a96e, transparent)',
          margin:'2.2rem 0',
          transition:'width 1.1s ease',
        }} />

        {/* CTA */}
        <div
          onClick={() => window.location.href = '/products'}
          style={{
            fontFamily:'monospace',
            fontSize:'clamp(1rem, 2.8vw, 2rem)',
            color:'#000',
            background:'#c8a96e',
            padding:'clamp(0.65rem,1.4vw,1.1rem) clamp(1.8rem,4.5vw,4rem)',
            letterSpacing:'0.32em',
            fontWeight:'900',
            cursor:'pointer',
            opacity: p >= 3 ? 1 : 0,
            transform: p >= 3 ? 'scale(1)' : 'scale(0.75)',
            transition:'all 0.7s cubic-bezier(0.16,1,0.3,1)',
            boxShadow:'0 0 35px rgba(200,169,110,0.55), 0 0 90px rgba(200,169,110,0.2)',
          }}
        >SHOP NOW</div>
      </div>
    </>
  )
}

/* Scene label (bottom-center progress dots) */
function SceneProgress({ scene }) {
  return (
    <div style={{
      position:'absolute', bottom:'1.5rem', left:'50%',
      transform:'translateX(-50%)',
      display:'flex', gap:'0.45rem',
      zIndex:20, pointerEvents:'none',
    }}>
      {DURATIONS.map((_, i) => (
        <div key={i} style={{
          width: i === scene ? '22px' : '5px',
          height:'3px',
          background: i <= scene ? 'rgba(200,169,110,0.8)' : 'rgba(255,255,255,0.12)',
          transition:'all 0.45s ease',
          borderRadius:'1.5px',
        }} />
      ))}
    </div>
  )
}

/* VHS timestamp */
function VHSStamp({ scene }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const min = String(Math.floor(tick / 60)).padStart(2,'0')
  const sec = String(tick % 60).padStart(2,'0')
  return (
    <div style={{
      position:'absolute', top:'1.5rem', left:'2rem',
      fontFamily:'monospace', fontSize:'clamp(0.5rem,0.9vw,0.72rem)',
      color:'rgba(255,255,255,0.35)', letterSpacing:'0.12em',
      zIndex:20, pointerEvents:'none',
    }}>
      <span style={{ color: scene < 7 ? 'rgba(255,80,80,0.8)' : 'rgba(255,255,255,0.2)' }}>
        {scene < 7 ? '⏺ REC' : '⏹ STOP'}
      </span>
      {'  '}{min}:{sec}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function PromoPage() {
  const [scene,   setScene]   = useState(0)
  const [glitch,  setGlitch]  = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  /* Auto-advance scenes */
  useEffect(() => {
    if (!mounted) return
    let total = 0
    const timers = DURATIONS.map((dur, i) => {
      const t = setTimeout(() => {
        setScene(i + 1)
        setGlitch(true)
        setTimeout(() => setGlitch(false), 320)
      }, total += dur)
      return t
    })
    return () => timers.forEach(clearTimeout)
  }, [mounted])

  /* Random micro-glitches */
  useEffect(() => {
    if (!mounted) return
    const id = setInterval(() => {
      if (Math.random() < 0.18) {
        setGlitch(true)
        setTimeout(() => setGlitch(false), 70 + Math.random() * 160)
      }
    }, 1800)
    return () => clearInterval(id)
  }, [mounted])

  const particlePhase = useMemo(() => {
    if (scene === 3) return 0   // scattered
    if (scene === 4) return 1   // converging
    if (scene === 5) return 3   // rotating
    if (scene === 6) return 4   // close-up spinning
    if (scene === 7) return 5   // frozen
    return -1
  }, [scene])

  if (!mounted) return <div style={{ background:'#000', width:'100vw', height:'100vh' }} />

  return (
    <div style={{ position:'relative', width:'100vw', height:'100vh', overflow:'hidden', background:'#000' }}>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes flicker {
          0%,100% { opacity:1; }
          33%      { opacity:0.75; }
          66%      { opacity:0.92; }
          80%      { opacity:0.5; }
        }
        @keyframes glitch {
          0%,82%,100% { transform:translateX(0) skewX(0); filter:none; }
          83%  { transform:translateX(-5px) skewX(-2deg); filter:drop-shadow(4px 0 #ff0066) drop-shadow(-4px 0 #00ffee); }
          84%  { transform:translateX(5px)  skewX(1.5deg); filter:drop-shadow(-3px 0 #ff0066) drop-shadow(3px 0 #00ffee); }
          85%  { transform:translateX(0) skewX(0); filter:none; }
          91%  { transform:translateX(-2px); filter:drop-shadow(2px 0 #ff0066); }
          92%  { transform:translateX(0); filter:none; }
        }
        @keyframes sweep {
          0%   { top:-1%; }
          100% { top:101%; }
        }
      `}</style>

      {/* ── THREE.JS CANVAS ── */}
      <Canvas
        shadows
        gl={{ antialias:true, alpha:false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure:1.2 }}
        style={{ position:'absolute', inset:0 }}
        camera={{ position:[0, 0.3, 8.5], fov:60, near:0.01, far:120 }}
      >
        <Scene3D scene={scene} particlePhase={particlePhase} />
      </Canvas>

      {/* ── HTML OVERLAYS ── */}
      <BedroomLayer visible={scene === 2} />
      <TVText       scene={scene} />
      <RetroHUD     visible={scene === 5 || scene === 6} />
      <FinalLayer   visible={scene === 7} />

      {/* ── VHS EFFECTS (always on top) ── */}
      <VHSLayer scene={scene} glitch={glitch} />
      <ScanSweep />

      {/* ── UI CHROME ── */}
      <VHSStamp    scene={scene} />
      <SceneProgress scene={Math.min(scene, 7)} />

      {/* Chromatic aberration overlay when glitching */}
      {glitch && (
        <div style={{
          position:'absolute', inset:0, zIndex:21, pointerEvents:'none',
          filter:'drop-shadow(3px 0 rgba(255,0,80,0.35)) drop-shadow(-3px 0 rgba(0,200,255,0.35))',
          mixBlendMode:'screen',
          animation:'flicker 0.08s 3',
        }} />
      )}
    </div>
  )
}
