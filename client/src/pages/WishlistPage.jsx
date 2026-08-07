import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { useWishlist } from '../contexts/WishlistContext';
export default function WishlistPage(){const{items,loading}=useWishlist();return <><PageHero eyebrow="CUSTOMER SAVED ITEMS" title="Your wishlist" text="Wishlist relationships are stored against the logged-in MongoDB user account and remain available across devices." compact/><section className="section"><div className="container">{loading?<Loading/>:items.length?<div className="product-grid">{items.map(p=><ProductCard key={p._id} product={p}/>)}</div>:<div className="empty-state"><h2>No saved clothing yet</h2><p>Use the heart button on product cards or product details to save a piece.</p><Link className="button primary" to="/shop">Browse products</Link></div>}</div></section></>}
