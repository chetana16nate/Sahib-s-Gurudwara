import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_DESCRIPTION =
  "Visit Sahib's Gurudwara in Accra, Ghana—a welcoming Sikh place of worship for prayer, seva, community programs and Guru Ka Langar.";
const SITE_URL = "https://www.sahibsgurudwara.com";

const pageSeo = {
  "/": ["Sahib's Gurudwara | Sikh Temple in Accra, Ghana", DEFAULT_DESCRIPTION],
  "/about": ["About Sahib's Gurudwara | Accra, Ghana", "Learn about Sahib's Gurudwara, our Sikh faith, community and commitment to seva in Accra, Ghana."],
  "/services": ["Community Services | Sahib's Gurudwara", "Explore Langar, healthcare, learning and community services at Sahib's Gurudwara in Accra."],
  "/programs": ["Programs and Events | Sahib's Gurudwara", "Discover prayer, learning and community programs at Sahib's Gurudwara in Accra, Ghana."],
  "/gallery": ["Gallery | Sahib's Gurudwara", "See community, worship and seva moments from Sahib's Gurudwara in Accra, Ghana."],
  "/reviews": ["Community Reviews | Sahib's Gurudwara", "Read experiences shared by visitors and members of the Sahib's Gurudwara community."],
  "/contact": ["Visit and Contact Sahib's Gurudwara | Accra", "Find contact details, directions and visitor information for Sahib's Gurudwara in Accra, Ghana."],
  "/seva": ["Join Seva | Sahib's Gurudwara", "Volunteer and take part in selfless community service at Sahib's Gurudwara."],
  "/cafe": ["Community Café | Sahib's Gurudwara", "Learn about the welcoming community café at Sahib's Gurudwara in Accra."],
};

function setMeta(name, content) {
  let element = document.head.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setProperty(property, content) {
  let element = document.head.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", url);
}

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const [title, description] = pageSeo[pathname] || ["Sahib's Gurudwara", DEFAULT_DESCRIPTION];
    const isPrivatePage = pathname.startsWith("/admin") || pathname.startsWith("/user");
    const canonicalUrl = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

    document.title = title;
    setMeta("description", description);
    setMeta("robots", isPrivatePage ? "noindex, nofollow" : "index, follow");
    setMeta("theme-color", "#102a43");
    setMeta("apple-mobile-web-app-title", "Sahib's Gurudwara");
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:url", canonicalUrl);
    setCanonical(canonicalUrl);
  }, [pathname]);

  return null;
}
