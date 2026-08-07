import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { api,imageUrl } from '../api';
import PageHero from '../components/PageHero';
import Loading from '../components/Loading';
export default function CategoriesPage(){const[categories,setCategories]=useState([]);const[loading,setLoading]=useState(true);useEffect(()=>{api('/categories').then(d=>setCategories(d.categories)).finally(()=>setLoading(false));},[]);return <><PageHero eyebrow="BROWSE BY COLLECTION" title="StyleHaven collections" text="Women, men, outerwear and accessories are related MongoDB category records rather than duplicated hard-coded pages."/><section className="section"><div className="container">{loading?<Loading/>:<div className="category-grid all-categories">{categories.map(c=><Link className="category-card" key={c._id} to={`/shop?category=${c.slug}`}><img src={imageUrl(c.image)} alt={c.name}/><div><h2>{c.name}</h2><p>{c.description}</p><span>Shop collection →</span></div></Link>)}</div>}</div></section></>}
