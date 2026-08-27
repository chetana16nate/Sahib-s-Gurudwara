import React from "react";
import { Link } from "react-router-dom";
import { Coffee, Croissant, IceCreamBowl, CakeSlice, Clock, MapPin, Sparkles, ArrowRight } from "lucide-react";
import "./Cafe.css";

const categories = [
  { title:"Freshly Brewed Coffee", subtitle:"Carefully selected beans, freshly prepared", icon:Coffee, tone:"coffee", items:[["Espresso","Rich and full-bodied single shot",20],["Americano","Espresso finished with hot water",22],["Cappuccino","Espresso, steamed milk and soft foam",25,"Popular"],["Café Latte","Smooth espresso with creamy steamed milk",28],["Mocha","Espresso, chocolate and steamed milk",30]] },
  { title:"Fresh Pastries", subtitle:"Flaky, buttery treats baked fresh", icon:Croissant, tone:"pastry", items:[["Butter Croissant","Classic flaky and buttery layers",35],["Chocolate Croissant","Flaky pastry with a chocolate centre",35,"Favourite"],["Cinnamon Roll","Soft swirl with cinnamon glaze",35],["Apple Danish","Buttery pastry with apple filling",35],["Blueberry Muffin","Soft muffin filled with blueberries",35]] },
  { title:"Cheesecake Selection", subtitle:"Creamy handcrafted slices in delightful flavours", icon:CakeSlice, tone:"cake", items:[["Classic Vanilla","Silky traditional baked cheesecake",40],["Strawberry","Fresh strawberry topping",40,"Popular"],["Blueberry","Creamy slice with blueberry compote",40],["Chocolate","Rich chocolate cheesecake",40],["Salted Caramel","Caramel with a touch of sea salt",40]] },
  { title:"Ice Cream", subtitle:"Cool and refreshing scoops for every mood", icon:IceCreamBowl, tone:"icecream", items:[["Vanilla Bean","Smooth and delicately fragrant",25],["Chocolate","Deep cocoa flavour",25],["Strawberry","Sweet and fruity",25],["Mango","Bright tropical mango",25,"Favourite"]] },
];

export default function Cafe(){return <main className="cafe-page">
  <header className="cafe-hero"><div className="cafe-hero-content"><span className="cafe-eyebrow"><Coffee size={17}/> SAHIB'S COFFEE CAFÉ</span><h1>A Warm Cup.<br/>A Peaceful Pause.</h1><p>Enjoy freshly brewed coffee and delightful treats in a welcoming community space.</p><div className="cafe-details"><span><Clock size={17}/> Open during Gurudwara hours</span><span><MapPin size={17}/> Sahib's Gurudwara, Accra</span></div></div></header>
  <section className="cafe-menu-shell"><div className="cafe-menu-heading"><span><Sparkles size={15}/> OUR CAFÉ MENU</span><h2>Made to Share &amp; Savour</h2><p>Fresh flavours, comforting favourites and prices shown in Ghana cedis.</p><div className="heading-ornament"><i/><b>ੴ</b><i/></div></div>
    <div className="cafe-menu-grid">{categories.map(({title,subtitle,icon:Icon,tone,items},index)=><article className={`menu-category menu-category--${tone}`} key={title}><header><div className="menu-category-icon"><Icon size={25}/></div><div><span className="category-number">0{index+1}</span><h3>{title}</h3><p>{subtitle}</p></div></header><ul>{items.map(([name,description,price,badge])=><li key={name}><div className="menu-item-copy"><div className="menu-item-title"><strong>{name}</strong>{badge&&<em>{badge}</em>}</div><small>{description}</small></div><span className="menu-price"><small>GHS</small>{price}</span></li>)}</ul></article>)}</div>
    <div className="cafe-note"><div className="cafe-note-icon"><Coffee size={25}/></div><div><strong>Please ask our café team about today's availability.</strong><p>Items may vary by day. Your support helps us continue serving the community.</p></div><Link to="/contact">Contact Us <ArrowRight size={17}/></Link></div>
  </section></main>}
