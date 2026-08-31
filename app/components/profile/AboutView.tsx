/* eslint-disable @next/next/no-img-element -- The local UMA logo is served as an already optimized static asset. */
import { Box, GraduationCap, HeartPulse, MapPin } from "lucide-react";

export function AboutView() {
  return (
    <section className="content-view about-view" aria-labelledby="about-title">
      <div className="about-brand"><img src="/uma-logo.jpg" alt="UMA Universidad María Auxiliadora" /></div>
      <span className="content-kicker"><Box size={15} /> Recurso educativo</span>
      <h1 id="about-title">Simulador de Anatomía 3D</h1>
      <p className="about-lead">Herramienta interactiva diseñada para apoyar el aprendizaje y la exploración de anatomía mediante modelos tridimensionales.</p>
      <div className="about-facts"><article><GraduationCap size={20} /><div><b>Universidad María Auxiliadora</b><span>Comunidad universitaria UMA</span></div></article><article><MapPin size={20} /><div><b>Lima, Perú</b><span>Experiencia de aprendizaje digital</span></div></article><article><HeartPulse size={20} /><div><b>Exploración anatómica</b><span>Nueve modelos interactivos disponibles</span></div></article></div>
      <aside>Este simulador es un recurso educativo complementario. No sustituye la enseñanza clínica, el criterio profesional ni la orientación médica.</aside>
    </section>
  );
}
