import { Link } from 'react-router-dom';
export default function NotFoundPage() { return <section className="section"><div className="container empty-state"><p className="eyebrow">404</p><h1>Page not found</h1><p>The requested StyleHaven page does not exist.</p><Link className="button primary" to="/">Return home</Link></div></section>; }
